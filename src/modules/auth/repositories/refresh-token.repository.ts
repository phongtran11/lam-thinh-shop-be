import { LessThan, Repository, UpdateResult } from 'typeorm';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import {
  ERefreshTokenRevokeReason,
  REFRESH_TOKEN_REVOKE_REASON,
} from 'src/shared/constants/auth.constant';

@Injectable()
export class RefreshTokensRepository extends Repository<RefreshToken> {
  constructor(protected dataSource: DataSource) {
    super(RefreshToken, dataSource.createEntityManager());
  }

  async findActiveRefreshTokenByTokenId(
    tokenId: string,
  ): Promise<RefreshToken | null> {
    return this.createQueryBuilder('refreshToken')
      .select([
        'refreshToken',
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
      ])
      .leftJoinAndSelect('refreshToken.user', 'user')
      .where('refreshToken.id = :tokenId', { tokenId })
      .andWhere('refreshToken.isRevoked = :isRevoked', { isRevoked: false })
      .andWhere('refreshToken.expiresAt > :now', { now: new Date() })
      .getOne();
  }

  async findOneById(tokenId: string): Promise<RefreshToken | null> {
    return this.createQueryBuilder('refreshToken')
      .where('refreshToken.id = :tokenId', { tokenId })
      .getOne();
  }

  async revokeTokenByToken(
    tokenHash: string,
    reason: ERefreshTokenRevokeReason = REFRESH_TOKEN_REVOKE_REASON.MANUAL_REVOKE,
  ): Promise<UpdateResult> {
    return this.update(
      { tokenHash },
      {
        isRevoked: true,
        revokedAt: new Date(),
        revokeReason: reason,
      },
    );
  }

  async revokeTokenById(
    tokenId: string,
    reason: ERefreshTokenRevokeReason = REFRESH_TOKEN_REVOKE_REASON.MANUAL_REVOKE,
  ): Promise<UpdateResult> {
    return this.update(
      { id: tokenId },
      {
        isRevoked: true,
        revokedAt: new Date(),
        revokeReason: reason,
      },
    );
  }

  async cleanupExpiredTokens(): Promise<UpdateResult> {
    return this.update(
      {
        expiresAt: LessThan(new Date()),
        isRevoked: false,
      },
      {
        isRevoked: true,
        revokedAt: new Date(),
        revokeReason: REFRESH_TOKEN_REVOKE_REASON.EXPIRED,
      },
    );
  }
}
