import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { databaseConfig } from './configs/database.config';
import {
  jwtAccessTokenConfig,
  jwtRefreshTokenConfig,
} from './configs/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { LogMiddleWare } from './shared/middlewares/log.middleware';
import { ClsModule } from 'nestjs-cls';
import { RolesGuard } from './shared/guards/roles.guard';
import { PermissionsGuard } from './shared/guards/permissions.guard';
import { PinoLoggerModule } from './shared/pino-logger/pino-logger.module';
import { commonConfig } from './configs/common.config';
import { RolesPermissionsModule } from './modules/roles-permissions/roles-permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        jwtAccessTokenConfig,
        jwtRefreshTokenConfig,
        commonConfig,
      ],
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    PinoLoggerModule.forRoot(),

    // MODULES
    AuthModule,
    RolesPermissionsModule,
    UsersModule,
    SchedulesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleWare).forRoutes('*path');
  }
}
