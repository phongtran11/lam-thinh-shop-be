import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokensRepository } from '../auth/repositories/refresh-token.repository';
import { RefreshTokenCleanupService } from './services/refresh-token-cleanup.service';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  providers: [RefreshTokenCleanupService, RefreshTokensRepository],
})
export class SchedulesModule {}
