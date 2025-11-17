import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { TokenDto } from 'src/modules/auth/dto/token.dto';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { RefreshTokensRepository } from 'src/modules/auth/repositories/refresh-token.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { BaseTransaction } from 'src/shared/providers/transaction.provider';
import { EncryptionService } from 'src/shared/services/encryption.service';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class RegisterTransaction extends BaseTransaction {
  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
    protected readonly tokenService: TokenService,
    protected readonly encryptionService: EncryptionService,
    protected readonly usersRepository: UsersRepository,
    protected readonly refreshTokensRepository: RefreshTokensRepository,
  ) {
    super(dataSource);
    this.registerRepository(usersRepository);
    this.registerRepository(refreshTokensRepository);
  }

  async execute(newUser: User, refreshToken: RefreshToken): Promise<TokenDto> {
    await this.usersRepository.insert(newUser);

    const jwtPayload: JwtPayload = {
      sub: newUser.id,
      email: newUser.email,
      roleName: newUser.role.name,
    };

    const tokens = await this.tokenService.generateTokens(jwtPayload);
    const refreshTokenHash = this.encryptionService.hashToken(
      tokens.refreshToken,
    );

    refreshToken.userId = newUser.id;
    refreshToken.tokenHash = refreshTokenHash;
    refreshToken.expiresAt = this.tokenService.getRefreshTokenExpirationDate();

    await this.refreshTokensRepository.insert(refreshToken);

    return tokens;
  }
}
