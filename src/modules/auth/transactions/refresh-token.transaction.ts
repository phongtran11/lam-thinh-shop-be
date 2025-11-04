import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokensRepository } from '../repositories/refresh-token.repository';
import { BaseTransaction } from 'src/shared/providers/transaction.provider';
import { REFRESH_TOKEN_REVOKE_REASON } from 'src/shared/constants/auth.constant';

@Injectable()
export class RefreshTokenTransaction extends BaseTransaction {
  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
    protected readonly refreshTokensRepository: RefreshTokensRepository,
  ) {
    super(dataSource);
    this.registerRepository(refreshTokensRepository);
  }

  async execute(refreshTokenRevokeId: string, newRefreshToken: RefreshToken) {
    return this.transaction(async () => {
      await this.refreshTokensRepository.revokeTokenById(
        refreshTokenRevokeId,
        REFRESH_TOKEN_REVOKE_REASON.TOKEN_REFRESH,
      );
      await this.refreshTokensRepository.insert(newRefreshToken);
      return this.refreshTokensRepository.findOneById(newRefreshToken.id);
    });
  }
}
