import { DataSource } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { JwtPayload } from 'src/shared/modules/jwt-tokens/jwt-tokens.dto';
import { BaseTransaction } from 'src/shared/providers/transaction.provider';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokensRepository } from '../repositories/refresh-token.repository';

@Injectable()
export class LoginTransaction extends BaseTransaction {
  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
    protected readonly refreshTokensRepo: RefreshTokensRepository,
  ) {
    super(dataSource);
  }

  /**
   * Login transaction
   * - Insert new refresh token
   * - Return refresh token
   * - Throws BadRequestException if insert fails
   */
  async execute(
    jwtPayload: JwtPayload,
    refreshTokenHash: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    return this.transaction(async (entityManager) => {
      const refreshTokenRepo = entityManager.withRepository(
        this.refreshTokensRepo,
      );

      const refreshToken = refreshTokenRepo.create({
        id: jwtPayload.jti,
        userId: jwtPayload.sub,
        tokenHash: refreshTokenHash,
        expiresAt,
      });

      const result = await refreshTokenRepo.insert(refreshToken);

      if (result.identifiers.length === 0) {
        throw new BadRequestException('Failed to create refresh token');
      }

      return refreshToken;
    });
  }
}
