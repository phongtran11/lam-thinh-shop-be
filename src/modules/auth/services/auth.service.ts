import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenDto } from '../dto/token.dto';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { TokenService } from '../../../shared/services/token.service';
import { plainToInstance } from 'class-transformer';
import { JwtPayload } from '../dto/jwt-payload.dto';
import { UserDto } from '../../users/dto/user.response.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { RegisterDto } from '../dto/register.dto';
import { RegisterTransaction } from '../transactions/register.transaction';
import { RefreshTokensRepository } from '../repositories/refresh-token.repository';
import { RefreshTokenRequestDto } from '../dto/refresh-token.dto';
import { RefreshTokenRevokeReasonEnum } from '../enums/auth.enum';
import { RefreshTokenTransaction } from '../transactions/refresh-token.transaction';
import { LogoutDto } from '../dto/logout.dto';
import { RoleEnum } from 'src/shared/enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly encryptionService: EncryptionService,
    private readonly tokenService: TokenService,
    private readonly registerTransaction: RegisterTransaction,
    private readonly refreshTokenTransaction: RefreshTokenTransaction,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) return plainToInstance(UserDto, null);

    const isCorrectPassword = await this.encryptionService.compare(
      password,
      user.password,
    );

    if (user && isCorrectPassword) {
      return plainToInstance(UserDto, user);
    }
    return plainToInstance(UserDto, null);
  }

  async login(
    user: JwtPayload,
    ipAddress: string,
    userAgent: string,
  ): Promise<TokenDto> {
    const tokens = await this.tokenService.generateTokens(user);

    await this.refreshTokensRepository.insert({
      userId: user.sub,
      token: tokens.refreshToken,
      expiresAt: this.tokenService.getRefreshTokenExpirationDate(),
      ipAddress,
      userAgent,
    });

    return plainToInstance(TokenDto, tokens);
  }

  async register(
    registerDto: RegisterDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<TokenDto> {
    const existingUser = await this.usersRepository.findOneByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await this.encryptionService.hash(
      registerDto.password,
    );

    const newUser = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
      roleName: RoleEnum.CUSTOMER,
    });

    const refreshToken = this.refreshTokensRepository.create({
      ipAddress,
      userAgent,
    });

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

    const tokenEntity =
      await this.refreshTokensRepository.findValidTokenByToken(refreshToken);

    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersRepository.findOneByUserId(tokenEntity.userId);
    if (!user) {
      await this.refreshTokensRepository.revokeTokenById(
        tokenEntity.id,
        RefreshTokenRevokeReasonEnum.USER_NOT_FOUND,
      );
      throw new UnauthorizedException('User not found');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleName: user.roleName,
    };

    const newTokens = await this.tokenService.generateTokens(payload);

    const newRefreshToken = this.refreshTokensRepository.create({
      userId: user.id,
      token: newTokens.refreshToken,
      expiresAt: this.tokenService.getRefreshTokenExpirationDate(),
      ipAddress: tokenEntity.ipAddress,
      userAgent: tokenEntity.userAgent,
    });

    await this.refreshTokenTransaction.execute(tokenEntity.id, newRefreshToken);

    return plainToInstance(TokenDto, newTokens);
  }

  async logout(logoutDto: LogoutDto): Promise<void> {
    await this.refreshTokensRepository.revokeTokenByToken(
      logoutDto.refreshToken,
      RefreshTokenRevokeReasonEnum.USER_LOGOUT,
    );
  }
}
