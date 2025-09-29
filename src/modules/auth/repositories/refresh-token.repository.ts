import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager, LessThan, UpdateResult } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenRevokeReasonEnum } from '../enums/auth.enum';

@Injectable()
export class RefreshTokensRepository extends Repository<RefreshToken> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(RefreshToken, entityManager, entityManager.queryRunner);
  }

  async findValidTokenByToken(token: string): Promise<RefreshToken | null> {
    return this.createQueryBuilder('refreshToken')
      .leftJoin('refreshToken.user', 'user')
      .addSelect(['user.id', 'user.email', 'user.firstName', 'user.lastName'])
      .where('refreshToken.token = :token', { token })
      .andWhere('refreshToken.isRevoked = :isRevoked', { isRevoked: false })
      .andWhere('refreshToken.expiresAt > :now', { now: new Date() })
      .getOne();
  }

  async revokeTokenByToken(
    token: string,
    reason: RefreshTokenRevokeReasonEnum = RefreshTokenRevokeReasonEnum.MANUAL_REVOKE,
  ): Promise<void> {
    await this.update(
      { token },
      {
        isRevoked: true,
        revokedAt: new Date(),
        revokeReason: reason,
      },
    );
  }

  async revokeTokenById(
    tokenId: string,
    reason: RefreshTokenRevokeReasonEnum = RefreshTokenRevokeReasonEnum.MANUAL_REVOKE,
  ): Promise<void> {
    await this.update(
      { id: tokenId },
      {
        isRevoked: true,
        revokedAt: new Date(),
        revokeReason: reason,
      },
    );
  }

  async cleanupExpiredTokens(): Promise<UpdateResult> {
    return await this.update(
      {
        expiresAt: LessThan(new Date()),
        isRevoked: false,
      },
      {
        isRevoked: true,
        revokedAt: new Date(),
        revokeReason: 'expired',
      },
    );
  }
}
