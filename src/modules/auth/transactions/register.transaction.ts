import { BaseTransaction } from 'src/shared/providers/transaction.provider';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { RefreshTokensRepository } from '../repositories/refresh-token.repository';
import { TokenDto } from '../dto/token.dto';
import { TokenService } from 'src/shared/services/token.service';
import { JwtPayload } from '../dto/jwt-payload.dto';
import { Injectable } from '@nestjs/common';
import { RefreshToken } from '../entities/refresh-token.entity';
import { EncryptionService } from 'src/shared/services/encryption.service';

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
      roleId: newUser.roleId,
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
