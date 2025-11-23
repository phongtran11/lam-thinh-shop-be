import { plainToInstance } from 'class-transformer';
import { ClsService } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import { AuthResDto, AuthUserResDto } from 'src/modules/auth/dto/auth.dto';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { LogoutDto } from 'src/modules/auth/dto/logout.dto';
import { GetMeResponseDto } from 'src/modules/auth/dto/me.dto';
import { RefreshTokenRequestDto } from 'src/modules/auth/dto/refresh-token.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { RefreshTokensRepository } from 'src/modules/auth/repositories/refresh-token.repository';
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
  HTTPNotFoundException,
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
    private readonly refreshTokenTransaction: RefreshTokenTransaction,
    private readonly clsService: ClsService,
    private readonly roleRepository: RoleRepository,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithRoleDto> {
    const user = await this.usersRepository.findOneWithRoleByEmail(email);

    if (!user) return plainToInstance(UserWithRoleDto, null);

    const isCorrectPassword = await this.encryptionService.compare(
      user.password,
      password,
    );

    if (user && isCorrectPassword) {
      return plainToInstance(UserWithRoleDto, user);
    }
    return plainToInstance(UserWithRoleDto, null);
  }

  async login(user: JwtPayload): Promise<AuthResDto> {
    const tokens = await this.tokenService.generateTokens(user);
    const refreshTokenHash = await this.encryptionService.hash(
      tokens.refreshToken,
    );

    await this.refreshTokensRepository.insert({
      id: user.jti,
      userId: user.sub,
      tokenHash: refreshTokenHash,
      expiresAt: this.tokenService.getRefreshTokenExpirationDate(),
    });

    const userEntity = await this.usersRepository.findOneByEmail(user.email);

    return plainToInstance(AuthResDto, {
      ...tokens,
      user: plainToInstance(AuthUserResDto, userEntity),
    });
  }

  async register(registerDto: RegisterDto): Promise<AuthResDto> {
    const existingUser = await this.usersRepository.existsByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new HTTPConflictException('Email is already in use');
    }

    const [hashedPassword, customerRole] = await Promise.all([
      this.encryptionService.hash(registerDto.password),
      this.roleRepository.findOneByName(ROLES.CUSTOMER),
    ]);

    if (!customerRole) {
      throw new HTTPBadRequestException('Customer role not found');
    }

    const newUser = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
      roleId: customerRole.id,
    });

    const refreshToken = this.refreshTokensRepository.create();

    const { token, user } = await this.registerTransaction.execute(
      newUser,
      refreshToken,
    );

    return plainToInstance(AuthResDto, {
      ...token,
      user: plainToInstance(AuthUserResDto, user),
    });
  }

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

    const user = await this.usersRepository.findOneWithRolePermissionsById(
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

  async getMe(): Promise<GetMeResponseDto> {
    const userId = this.clsService.get<JwtPayload>(CLS_KEY.JWT_PAYLOAD)?.sub;
    const user =
      await this.usersRepository.findOneWithRolePermissionById(userId);

    if (!user) {
      throw new HTTPNotFoundException('User not found');
    }

    return plainToInstance(GetMeResponseDto, user);
  }
}
