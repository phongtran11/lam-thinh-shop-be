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

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RoleController, PermissionsController],
  providers: [
    RoleService,
    PermissionService,
    RoleRepository,
    PermissionRepository,
  ],
  exports: [RoleService, PermissionService],
})
export class RolesModule {}
