import { LessThan, Repository, UpdateResult, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { REFRESH_TOKEN_REVOKE_REASON } from '../constants/refresh-token.dto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenRevokeReason } from '../types/refresh-token.constant';

@Injectable()
export class RefreshTokensRepository extends Repository<RefreshToken> {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {
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
    reason: RefreshTokenRevokeReason = REFRESH_TOKEN_REVOKE_REASON.MANUAL_REVOKE,
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
    reason: RefreshTokenRevokeReason = REFRESH_TOKEN_REVOKE_REASON.MANUAL_REVOKE,
  ): Promise<UpdateResult> {
    return this.update(
      { id: tokenId, isRevoked: false },
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
