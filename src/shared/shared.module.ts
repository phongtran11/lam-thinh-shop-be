import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PermissionRepository } from 'src/modules/roles-permissions/repositories/permission.repository';
import { RolePermissionsRepository } from 'src/modules/roles-permissions/repositories/role-permissions.repository';
import { RoleRepository } from 'src/modules/roles-permissions/repositories/role.repository';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { EncryptionService } from 'src/shared/services/encryption.service';
import { TokenService } from 'src/shared/services/token.service';

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
