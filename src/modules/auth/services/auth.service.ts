import { plainToInstance } from 'class-transformer';
import { ClsService } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import { AuthResDto, AuthUserResDto } from 'src/modules/auth/dto/auth.dto';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { LogoutDto } from 'src/modules/auth/dto/logout.dto';
import { RefreshTokenRequestDto } from 'src/modules/auth/dto/refresh-token.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { RefreshTokensRepository } from 'src/modules/auth/repositories/refresh-token.repository';
import { LoginTransaction } from 'src/modules/auth/transactions/login.transaction';
import { RefreshTokenTransaction } from 'src/modules/auth/transactions/refresh-token.transaction';
import { RegisterTransaction } from 'src/modules/auth/transactions/register.transaction';
import { RoleRepository } from 'src/modules/roles-permissions/repositories/role.repository';
import { UserWithRoleDto } from 'src/modules/users/dtos/user.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { REFRESH_TOKEN_REVOKE_REASON } from 'src/shared/constants/auth.constant';
import { CLS_KEY } from 'src/shared/constants/cls.constant';
import { ROLES } from 'src/shared/constants/role.constant';
import {
  HTTPBadRequestException,
  HTTPConflictException,
  HTTPUnauthorizedException,
} from 'src/shared/exceptions';
import { EncryptionService } from 'src/shared/services/encryption.service';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly encryptionService: EncryptionService,
    private readonly tokenService: TokenService,
    private readonly registerTransaction: RegisterTransaction,
    private readonly loginTransaction: LoginTransaction,
    private readonly refreshTokenTransaction: RefreshTokenTransaction,
    private readonly clsService: ClsService,
    private readonly roleRepository: RoleRepository,
  ) {}

  /**
   * Login user
   * @param loginDto
   * @returns
   */
  async login(loginDto: LoginDto): Promise<AuthResDto> {
    // Validate user credentials
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new HTTPUnauthorizedException('Email or password are not correct');
    }

    // Create JWT payload
    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleName: user.role.name,
      jti: uuidv4(),
    };

    // Generate tokens
    const tokens = await this.tokenService.generateTokens(jwtPayload);
    const refreshTokenHash = await this.encryptionService.hash(
      tokens.refreshToken,
    );

    // Save refresh token in transaction to prevent race conditions
    await this.loginTransaction.execute(
      jwtPayload,
      refreshTokenHash,
      this.tokenService.getRefreshTokenExpirationDate(),
    );

    return plainToInstance(AuthResDto, {
      ...tokens,
      user: plainToInstance(AuthUserResDto, user),
    });
  }

  /**
   * Validate user credentials
   * @param email
   * @param password
   * @returns
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithRoleDto | null> {
    const user = await this.usersRepository.findOneWithRoleByEmail(email);

    // Always compare password to prevent timing attacks
    const isCorrectPassword = await this.encryptionService.compare(
      user?.password || '',
      password,
    );

    if (user && isCorrectPassword) {
      return plainToInstance(UserWithRoleDto, user);
    }
    return null;
  }

  /**
   * Register new user
   * @param registerDto
   * @returns
   */
  async register(registerDto: RegisterDto): Promise<AuthResDto> {
    const existingUser = await this.usersRepository.existsByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new HTTPConflictException('Email is already in use');
    }

    const hashedPassword = await this.encryptionService.hash(
      registerDto.password,
    );

    const customerRole = await this.roleRepository.findOneByName(
      ROLES.CUSTOMER,
    );

    if (!customerRole) {
      throw new HTTPBadRequestException('Customer role not found');
    }

    const newUser = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
      roleId: customerRole.id,
    });

    const { tokens, user } = await this.registerTransaction.execute(
      newUser,
      customerRole,
    );

    return plainToInstance(AuthResDto, {
      ...tokens,
      user: plainToInstance(AuthUserResDto, user),
    });
  }

  /**
   * Refresh tokens
   * @param refreshTokenRequestDto
   * @returns
   */
  async refreshToken(
    refreshTokenRequestDto: RefreshTokenRequestDto,
  ): Promise<AuthResDto> {
    const jwtPayload = this.tokenService.verifyRefreshToken(
      refreshTokenRequestDto.refreshToken,
    );

    const tokenEntity =
      await this.refreshTokensRepository.findActiveRefreshTokenByTokenId(
        jwtPayload.jti,
      );

    if (!tokenEntity) {
      throw new HTTPUnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersRepository.findOneWithRoleById(
      tokenEntity.userId,
    );

    if (!user) {
      await this.refreshTokensRepository.revokeTokenById(
        tokenEntity.id,
        REFRESH_TOKEN_REVOKE_REASON.USER_NOT_FOUND,
      );
      throw new HTTPUnauthorizedException('User not found');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleName: user.role.name,
      jti: uuidv4(),
    };

    const newTokens = await this.tokenService.generateTokens(payload);
    const refreshTokenHash = await this.encryptionService.hash(
      newTokens.refreshToken,
    );
    const newRefreshToken = this.refreshTokensRepository.create({
      id: payload.jti,
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: this.tokenService.getRefreshTokenExpirationDate(),
    });

    await this.refreshTokenTransaction.execute(tokenEntity.id, newRefreshToken);

    return plainToInstance(AuthResDto, {
      ...newTokens,
      user: plainToInstance(AuthUserResDto, user),
    });
  }

  /**
   * Logout user by revoking their refresh token
   * @param logoutDto
   */
  async logout(logoutDto: LogoutDto): Promise<void> {
    const jwtPayload = this.tokenService.verifyRefreshToken(
      logoutDto.refreshToken,
    );

    const validTokenByToken =
      await this.refreshTokensRepository.findActiveRefreshTokenByTokenId(
        jwtPayload.jti,
      );

    if (!validTokenByToken) {
      throw new HTTPUnauthorizedException(
        'Refresh token not found or already revoked',
      );
    }

    const userId = this.clsService.get<JwtPayload>(CLS_KEY.JWT_PAYLOAD)?.sub;

    if (validTokenByToken.userId !== userId) {
      throw new HTTPUnauthorizedException(
        'Refresh token does not belong to the user',
      );
    }

    await this.refreshTokensRepository.revokeTokenByToken(
      validTokenByToken.tokenHash,
      REFRESH_TOKEN_REVOKE_REASON.USER_LOGOUT,
    );
  }
}
