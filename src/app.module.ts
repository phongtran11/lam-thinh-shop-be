import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
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
import { LoggerModule } from 'pino-nestjs';
import { Request } from 'express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtAccessTokenConfig, jwtRefreshTokenConfig],
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        serializers: {
          req(request: Request) {
            const clonedRequest = structuredClone(request);
            if (clonedRequest.headers?.authorization) {
              clonedRequest.headers.authorization = '*****';
            }
            return clonedRequest;
          },
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
      forRoutes: ['*path'],
    }),

    // MODULES
    AuthModule,
    RolesModule,
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
