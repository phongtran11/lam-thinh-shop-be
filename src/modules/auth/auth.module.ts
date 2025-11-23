import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/modules/auth/controllers/auth.controller';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { RefreshTokensRepository } from 'src/modules/auth/repositories/refresh-token.repository';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { RefreshTokenTransaction } from 'src/modules/auth/transactions/refresh-token.transaction';
import { RegisterTransaction } from 'src/modules/auth/transactions/register.transaction';
import { UsersModule } from 'src/modules/users/users.module';
import { SharedModule } from 'src/shared/shared.module';
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
  exports: [AuthService, RefreshTokensRepository],
})
export class AuthModule {}
