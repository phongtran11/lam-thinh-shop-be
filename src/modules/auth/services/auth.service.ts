import { plainToInstance } from 'class-transformer';
import { ClsService } from 'nestjs-cls';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { LogoutDto } from 'src/modules/auth/dto/logout.dto';
import { GetMeResponseDto } from 'src/modules/auth/dto/me.dto';
import { RefreshTokenRequestDto } from 'src/modules/auth/dto/refresh-token.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { TokenDto } from 'src/modules/auth/dto/token.dto';
import { RefreshTokensRepository } from 'src/modules/auth/repositories/refresh-token.repository';
import { RefreshTokenTransaction } from 'src/modules/auth/transactions/refresh-token.transaction';
import { RegisterTransaction } from 'src/modules/auth/transactions/register.transaction';
import { RoleRepository } from 'src/modules/roles-permissions/repositories/role.repository';
import { UserWithRoleDto } from 'src/modules/users/dtos/user.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { REFRESH_TOKEN_REVOKE_REASON } from 'src/shared/constants/auth.constant';
import { CLS_KEY } from 'src/shared/constants/cls.constant';
import { ROLES } from 'src/shared/constants/role.constant';
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
      password,
      user.password,
    );

    if (user && isCorrectPassword) {
      return plainToInstance(UserWithRoleDto, user);
    }
    return plainToInstance(UserWithRoleDto, null);
  }

  async login(user: JwtPayload): Promise<TokenDto> {
    const tokens = await this.tokenService.generateTokens(user);
    const refreshTokenHash = this.encryptionService.hashToken(
      tokens.refreshToken,
    );

    await this.refreshTokensRepository.insert({
      userId: user.sub,
      tokenHash: refreshTokenHash,
      expiresAt: this.tokenService.getRefreshTokenExpirationDate(),
    });

    return plainToInstance(TokenDto, tokens);
  }

  async register(registerDto: RegisterDto): Promise<TokenDto> {
    const existingUser = await this.usersRepository.findOneByEmail(
      registerDto.email,
    );

    if (existingUser) {
      this.logger.warn(`Email ${registerDto.email} is already in use`);
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await this.encryptionService.hash(
      registerDto.password,
    );

    const customerRole = await this.roleRepository.findOneByName(
      ROLES.CUSTOMER,
    );

    if (!customerRole) {
      throw new BadRequestException('Customer role not found');
    }

    const newUser = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
      roleId: customerRole.id,
    });

    const refreshToken = this.refreshTokensRepository.create();

    const tokens = await this.registerTransaction.execute(
      newUser,
      refreshToken,
    );

    return plainToInstance(TokenDto, tokens);
  }

  async refreshToken(
    refreshTokenRequestDto: RefreshTokenRequestDto,
  ): Promise<TokenDto> {
    const { refreshToken } = refreshTokenRequestDto;

    const requestedTokenHash = this.encryptionService.hashToken(refreshToken);

    const tokenEntity =
      await this.refreshTokensRepository.findActiveTokenByHash(
        requestedTokenHash,
      );

    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersRepository.findOneWithRolePermissionsById(
      tokenEntity.userId,
    );
    if (!user) {
      await this.refreshTokensRepository.revokeTokenById(
        tokenEntity.id,
        REFRESH_TOKEN_REVOKE_REASON.USER_NOT_FOUND,
      );
      throw new UnauthorizedException('User not found');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleName: user.role.name,
    };

    const newTokens = await this.tokenService.generateTokens(payload);
    const refreshTokenHash = this.encryptionService.hashToken(
      newTokens.refreshToken,
    );
    const newRefreshToken = this.refreshTokensRepository.create({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: this.tokenService.getRefreshTokenExpirationDate(),
    });

    await this.refreshTokenTransaction.execute(tokenEntity.id, newRefreshToken);

    return plainToInstance(TokenDto, newTokens);
  }

  async logout(logoutDto: LogoutDto): Promise<void> {
    const tokenHash = this.encryptionService.hashToken(logoutDto.refreshToken);
    const validTokenByToken =
      await this.refreshTokensRepository.findActiveTokenByHash(tokenHash);

    if (!validTokenByToken) {
      this.logger.warn(`Refresh token not found or already revoked`);
      throw new UnauthorizedException(
        'Refresh token not found or already revoked',
      );
    }

    const userId = this.clsService.get<JwtPayload>(CLS_KEY.JWT_PAYLOAD)?.sub;

    if (validTokenByToken.userId !== userId) {
      throw new UnauthorizedException(
        'Refresh token does not belong to the user',
      );
    }

    await this.refreshTokensRepository.revokeTokenByToken(
      tokenHash,
      REFRESH_TOKEN_REVOKE_REASON.USER_LOGOUT,
    );
  }

  async getMe(): Promise<GetMeResponseDto> {
    const userId = this.clsService.get<JwtPayload>(CLS_KEY.JWT_PAYLOAD)?.sub;
    const user =
      await this.usersRepository.findOneWithRolePermissionById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(GetMeResponseDto, user);
  }
}
