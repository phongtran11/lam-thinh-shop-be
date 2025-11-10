import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { RoleController } from './controllers/role.controller';
import { RoleRepository } from './repositories/role.repository';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionsController } from './controllers/permission.controller';
import { RolePermissions } from './entities/role-permissions.entity';
import { RolePermissionsRepository } from './repositories/role-permissions.repository';

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
