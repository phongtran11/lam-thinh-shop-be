import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtTokensModule } from 'src/shared/modules/jwt-tokens/jwt-tokens.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokensRepository } from './repositories/refresh-token.repository';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginTransaction } from './transactions/login.transaction';
import { RefreshTokenTransaction } from './transactions/refresh-token.transaction';
import { RegisterTransaction } from './transactions/register.transaction';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    UsersModule,
    RolesModule,
    PassportModule,
    JwtTokensModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokensRepository,
    RegisterTransaction,
    LoginTransaction,
    RefreshTokenTransaction,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
