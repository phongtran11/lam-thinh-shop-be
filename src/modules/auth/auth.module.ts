import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/modules/auth/controllers/auth.controller';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { RefreshTokensRepository } from 'src/modules/auth/repositories/refresh-token.repository';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { LoginTransaction } from 'src/modules/auth/transactions/login.transaction';
import { RefreshTokenTransaction } from 'src/modules/auth/transactions/refresh-token.transaction';
import { RegisterTransaction } from 'src/modules/auth/transactions/register.transaction';
import { UsersModule } from 'src/modules/users/users.module';
import { SharedModule } from 'src/shared/shared.module';
import { JwtStrategy } from 'src/shared/strategies/jwt.strategy';
import { RoleRepository } from '../roles-permissions/repositories/role.repository';

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
    RefreshTokensRepository,
    RoleRepository,
    RegisterTransaction,
    LoginTransaction,
    RefreshTokenTransaction,
  ],
  exports: [AuthService, RefreshTokensRepository],
})
export class AuthModule {}
