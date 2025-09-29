import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { databaseConfig } from './configs/database.config';
import { jwtConfig, refreshJwtConfig } from './configs/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { LogMiddleWare } from './shared/middlewares/log.middleware';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, refreshJwtConfig],
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),

    // MODULES
    AuthModule,
    RolesModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleWare).forRoutes('*path');
  }
}
