import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { LessThan, UpdateResult } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';

import { BaseRepository } from 'src/shared/repositories/base.repository';
import { DataSource } from 'typeorm';
import {
  ERefreshTokenRevokeReason,
  REFRESH_TOKEN_REVOKE_REASON,
} from 'src/shared/constants/auth.constant';

@Injectable()
export class RefreshTokensRepository extends BaseRepository<RefreshToken> {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {
    super(dataSource, RefreshToken);
  }

  async findActiveTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.createQueryBuilder('refreshToken')
      .leftJoinAndSelect('refreshToken.user', 'user')
      .where('refreshToken.tokenHash = :tokenHash', { tokenHash })
      .andWhere('refreshToken.isRevoked = :isRevoked', { isRevoked: false })
      .andWhere('refreshToken.expiresAt > :now', { now: new Date() })
      .select([
        'refreshToken',
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
      ])
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
