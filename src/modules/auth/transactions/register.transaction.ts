import { TransactionProvider } from 'src/shared/providers/transaction.provider';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { RefreshTokensRepository } from '../repositories/refresh-token.repository';
import { TokenDto } from '../dto/token.dto';
import { TokenService } from 'src/shared/services/token.service';
import { JwtPayload } from '../dto/jwt-payload.dto';
import { Injectable } from '@nestjs/common';
import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class RegisterTransaction extends TransactionProvider<
  [User, RefreshToken],
  TokenDto
> {
  protected usersRepository: UsersRepository;
  protected refreshTokensRepository: RefreshTokensRepository;

  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
    protected readonly tokenService: TokenService,
  ) {
    super(dataSource);
  }

  protected initRepository(entityManager: EntityManager) {
    this.usersRepository = new UsersRepository(entityManager);
    this.refreshTokensRepository = new RefreshTokensRepository(entityManager);
  }

  protected async transaction(
    newUser: User,
    refreshToken: RefreshToken,
  ): Promise<TokenDto> {
    await this.usersRepository.insert(newUser);

    const jwtPayload: JwtPayload = {
      sub: newUser.id,
      email: newUser.email,
      roleName: newUser.roleName,
    };

    const tokens = await this.tokenService.generateTokens(jwtPayload);

    refreshToken.userId = newUser.id;
    refreshToken.token = tokens.refreshToken;
    refreshToken.expiresAt = this.tokenService.getRefreshTokenExpirationDate();

    await this.refreshTokensRepository.insert(refreshToken);

    return tokens;
  }
}
