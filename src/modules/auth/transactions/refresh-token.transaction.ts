import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { REFRESH_TOKEN_REVOKE_REASON } from 'src/shared/constants/auth.constant';
import { BaseTransaction } from 'src/shared/providers/transaction.provider';

@Injectable()
export class RefreshTokenTransaction extends BaseTransaction {
  constructor(protected readonly dataSource: DataSource) {
    super(dataSource);
  }

  /**
   * Refresh token transaction
   * - Revoke old refresh token
   * - Insert new refresh token
   * - Return new refresh token
   */
  async execute(refreshTokenRevokeId: string, newRefreshToken: RefreshToken) {
    return this.transaction(async (entityManager) => {
      const refreshTokensRepository = entityManager.getRepository(RefreshToken);

      await refreshTokensRepository.update(
        { id: refreshTokenRevokeId },
        {
          isRevoked: true,
          revokedAt: new Date(),
          revokeReason: REFRESH_TOKEN_REVOKE_REASON.TOKEN_REFRESH,
        },
      );

      await refreshTokensRepository.insert(newRefreshToken);

      return refreshTokensRepository
        .createQueryBuilder('refreshToken')
        .where('refreshToken.id = :tokenId', { tokenId: newRefreshToken.id })
        .getOne();
    });
  }
}
