import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RefreshTokenCleanupService } from './services/refresh-token-cleanup.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  providers: [RefreshTokenCleanupService],
})
export class SchedulesModule {}
