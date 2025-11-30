import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { BaseTransaction } from 'src/shared/providers/transaction.provider';

@Injectable()
export class LoginTransaction extends BaseTransaction {
  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  /**
   * Login transaction
   * - Insert new refresh token
   * - Handle duplicate key errors gracefully
   */
  async execute(
    jwtPayload: JwtPayload,
    refreshTokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    return this.transaction(async (entityManager) => {
      const refreshTokensRepository = entityManager.getRepository(RefreshToken);

      await refreshTokensRepository.insert({
        id: jwtPayload.jti,
        userId: jwtPayload.sub,
        tokenHash: refreshTokenHash,
        expiresAt,
      });
    });
  }
}
