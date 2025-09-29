import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { TransactionProvider } from 'src/shared/providers/transaction.provider';
import { DataSource, EntityManager } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokensRepository } from '../repositories/refresh-token.repository';
import { RefreshTokenRevokeReasonEnum } from '../enums/auth.enum';

@Injectable()
export class RefreshTokenTransaction extends TransactionProvider<
  [refreshTokenRevokeId: string, newRefreshToken: RefreshToken],
  void
> {
  protected refreshTokensRepository: RefreshTokensRepository;

  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  protected initRepository(entityManager: EntityManager): void {
    this.refreshTokensRepository = new RefreshTokensRepository(entityManager);
  }

  protected async transaction(
    refreshTokenRevokeId: string,
    newRefreshToken: RefreshToken,
  ): Promise<void> {
    await this.refreshTokensRepository.revokeTokenById(
      refreshTokenRevokeId,
      RefreshTokenRevokeReasonEnum.TOKEN_REFRESH,
    );
    await this.refreshTokensRepository.insert(newRefreshToken);
  }
}
