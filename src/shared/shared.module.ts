import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionService } from './services/encryption.service';
import { TokenService } from './services/token.service';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [EncryptionService, TokenService, RolesGuard, PermissionsGuard],
  exports: [EncryptionService, TokenService, RolesGuard, PermissionsGuard],
})
export class SharedModule {}
