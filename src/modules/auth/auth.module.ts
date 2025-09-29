import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { SharedModule } from '../../shared/shared.module';
import { RegisterTransaction } from './transactions/register.transaction';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokensRepository } from './repositories/refresh-token.repository';
import { RefreshTokenTransaction } from './transactions/refresh-token.transaction';
import { JwtStrategy } from 'src/shared/strategies/jwt.strategy';
import { LocalStrategy } from 'src/shared/strategies/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    UsersModule,
    PassportModule,
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RefreshTokensRepository,
    RegisterTransaction,
    RefreshTokenTransaction,
  ],
  exports: [
    AuthService,
    RefreshTokensRepository,
    RegisterTransaction,
    RefreshTokenTransaction,
  ],
})
export class AuthModule {}
