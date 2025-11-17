import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenCleanupService } from './services/refresh-token-cleanup.service';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  providers: [RefreshTokenCleanupService],
})
export class SchedulesModule {}
