import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController, RoleController } from './controllers';
import { Role, Permission, RolePermissions } from './entities';
import {
  RoleRepository,
  RolePermissionsRepository,
  PermissionRepository,
} from './repositories';
import { RoleService, PermissionService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, RolePermissions])],
  controllers: [RoleController, PermissionsController],
  providers: [
    RoleService,
    PermissionService,
    RoleRepository,
    PermissionRepository,
    RolePermissionsRepository,
  ],
  exports: [
    RoleService,
    PermissionService,
    RoleRepository,
    PermissionRepository,
    RolePermissionsRepository,
  ],
})
export class RolesPermissionsModule {}
