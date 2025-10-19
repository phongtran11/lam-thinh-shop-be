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

  async findActiveTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
    return await this.createQueryBuilder('refreshToken')
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

  async revokeTokenByToken(
    tokenHash: string,
    reason: RefreshTokenRevokeReasonEnum = RefreshTokenRevokeReasonEnum.MANUAL_REVOKE,
  ): Promise<UpdateResult> {
    return await this.update(
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
        revokeReason: RefreshTokenRevokeReasonEnum.EXPIRED,
      },
    );
  }
}
