import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokensRepository } from 'src/modules/auth/repositories/refresh-token.repository';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { CronjobNameEnum } from '../enums/cronjob-name.enum';

@Injectable()
export class RefreshTokenCleanupService {
  private readonly logger = new Logger(RefreshTokenCleanupService.name);

  constructor(
    private readonly refreshTokensRepository: RefreshTokensRepository,
  ) {}

  /**
   * Runs daily at 00:00 (midnight) to clean up inactive refresh tokens
   * Inactive tokens include:
   * - Expired tokens (expiresAt < now)
   * - Already revoked tokens
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: CronjobNameEnum.REFRESH_TOKEN_CLEANUP,
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleCleanupInactiveTokens() {
    this.logger.log('Starting cleanup of inactive refresh tokens...');

    try {
      // Mark expired tokens as revoked
      const expiredResult =
        await this.refreshTokensRepository.cleanupExpiredTokens();

      this.logger.log(
        `Successfully marked ${expiredResult.affected || 0} expired tokens as revoked`,
      );

      // Delete old inactive tokens (revoked or expired for more than 1 day)
      const oneDaysAgo = new Date();
      oneDaysAgo.setDate(oneDaysAgo.getDate() - 1);

      const deleteResult = await this.refreshTokensRepository
        .createQueryBuilder()
        .delete()
        .from(RefreshToken)
        .where('isRevoked = :isRevoked', { isRevoked: true })
        .andWhere('revokedAt < :oneDaysAgo', { oneDaysAgo })
        .execute();

      this.logger.log(
        `Successfully deleted ${deleteResult.affected || 0} old revoked tokens (older than 1 day)`,
      );

      this.logger.log(
        'Cleanup of inactive refresh tokens completed successfully',
      );
    } catch (error) {
      this.logger.error(
        'Failed to cleanup inactive refresh tokens',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
