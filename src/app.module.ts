import { ClsModule } from 'nestjs-cls';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { commonConfig } from 'src/configs/common.config';
import { databaseConfig } from 'src/configs/database.config';
import {
  jwtAccessTokenConfig,
  jwtRefreshTokenConfig,
} from 'src/configs/jwt.config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RolesPermissionsModule } from 'src/modules/roles-permissions/roles-permissions.module';
import { SchedulesModule } from 'src/modules/schedules/schedules.module';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { LogMiddleWare } from 'src/shared/middlewares/log.middleware';
import { PinoLoggerModule } from 'src/shared/pino-logger/pino-logger.module';

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
    PinoLoggerModule.forRootAsync(),

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
