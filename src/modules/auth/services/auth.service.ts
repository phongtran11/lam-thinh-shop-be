import { plainToInstance } from 'class-transformer';
import { ClsService } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import { ROLES } from 'src/modules/roles/constants/role.constant';
import { RoleRepository } from 'src/modules/roles/repositories/role.repository';
import { UserWithRoleDto } from 'src/modules/users/dtos/user.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { CLS_KEY } from 'src/shared/constants/cls.constant';
import {
  HTTPUnauthorizedException,
  HTTPConflictException,
  HTTPBadRequestException,
} from 'src/shared/exceptions/http-exceptions';
import { hashString, compareHashString } from 'src/shared/helpers/hash.helper';
import { JwtPayload } from 'src/shared/modules/jwt-tokens/jwt-tokens.dto';
import { JwtTokensService } from 'src/shared/modules/jwt-tokens/jwt-tokens.service';
import { REFRESH_TOKEN_REVOKE_REASON } from '../constants/refresh-token.dto';
import { AuthResDto, AuthUserResDto } from '../dtos/auth.dto';
import { LoginDto } from '../dtos/login.dto';
import { LogoutDto } from '../dtos/logout.dto';
import { RefreshTokenRequestDto } from '../dtos/refresh-token.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RefreshTokensRepository } from '../repositories/refresh-token.repository';
import { LoginTransaction } from '../transactions/login.transaction';
import { RefreshTokenTransaction } from '../transactions/refresh-token.transaction';
import { RegisterTransaction } from '../transactions/register.transaction';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly tokenService: JwtTokensService,
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
    const refreshTokenHash = await hashString(tokens.refreshToken);

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
    const isCorrectPassword = await compareHashString(
      user?.password || '$2b$10$invalidsaltstring22charsmin',
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

    const hashedPassword = await hashString(registerDto.password);

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
    const refreshTokenHash = await hashString(newTokens.refreshToken);
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
