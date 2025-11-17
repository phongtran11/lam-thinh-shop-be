import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './controllers/permission.controller';
import { RoleController } from './controllers/role.controller';
import { Permission } from './entities/permission.entity';
import { RolePermissions } from './entities/role-permissions.entity';
import { Role } from './entities/role.entity';
import { PermissionRepository } from './repositories/permission.repository';
import { RolePermissionsRepository } from './repositories/role-permissions.repository';
import { RoleRepository } from './repositories/role.repository';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';

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
