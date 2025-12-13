import { DataSource } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseTransaction } from 'src/shared/providers/transaction.provider';
import { REFRESH_TOKEN_REVOKE_REASON } from '../constants/refresh-token.dto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokensRepository } from '../repositories/refresh-token.repository';

@Injectable()
export class RefreshTokenTransaction extends BaseTransaction {
  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
    protected readonly refreshTokensRepo: RefreshTokensRepository,
  ) {
    super(dataSource);
  }

  /**
   * Refresh token transaction
   * - Revoke old refresh token
   * - Insert new refresh token
   * - Throws BadRequestException if revoke fails
   */
  async execute(
    refreshTokenRevokeId: string,
    newRefreshToken: RefreshToken,
  ): Promise<RefreshToken> {
    return this.transaction(async (entityManager) => {
      const refreshTokensRepo = entityManager.withRepository(
        this.refreshTokensRepo,
      );

      const result = await refreshTokensRepo.revokeTokenById(
        refreshTokenRevokeId,
        REFRESH_TOKEN_REVOKE_REASON.TOKEN_REFRESH,
      );

      if (result.affected === 0) {
        throw new BadRequestException('Invalid or expired refresh token');
      }

      await refreshTokensRepo.insert(newRefreshToken);

      return newRefreshToken;
    });
  }
}
