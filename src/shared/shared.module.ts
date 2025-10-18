import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionService } from './services/encryption.service';
import { TokenService } from './services/token.service';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RoleRepository } from 'src/modules/roles/repositories/role.repository';
import { PermissionRepository } from 'src/modules/roles/repositories/permission.repository';
import { RolePermissionsRepository } from 'src/modules/roles/repositories/role-permissions.repository';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [
    EncryptionService,
    TokenService,
    RolesGuard,
    PermissionsGuard,
    RoleRepository,
    PermissionRepository,
    RolePermissionsRepository,
  ],
  exports: [
    EncryptionService,
    TokenService,
    RolesGuard,
    PermissionsGuard,
    RoleRepository,
    PermissionRepository,
    RolePermissionsRepository,
  ],
})
export class SharedModule {}
