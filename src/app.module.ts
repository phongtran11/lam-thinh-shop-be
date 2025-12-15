import { ClsModule } from 'nestjs-cls';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { UserCustomersModule } from './modules/user-customers/user-customers.module';
import { UsersModule } from './modules/users/users.module';
import { configurations } from './shared/configs';
import { DatabaseModule } from './shared/databases/database.module';
import { LogMiddleWare } from './shared/middlewares/log.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    DatabaseModule.forRoot(),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),

    // MODULES
    AuthModule,
    RolesModule,
    PermissionsModule,
    UsersModule,
    UserCustomersModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleWare).forRoutes('*path');
  }
}
