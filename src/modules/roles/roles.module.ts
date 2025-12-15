import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './controllers/role.controller';
import { RolePermissions } from './entities/role-permissions.entity';
import { Role } from './entities/role.entity';
import { RolesGuard } from './guards/roles.guard';
import { RolePermissionsRepository } from './repositories/role-permissions.repository';
import { RoleRepository } from './repositories/role.repository';
import { RoleService } from './services/role.service';
import { UpsertRoleTransaction } from './transactions/upsert-role.transaction';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolePermissions])],
  controllers: [RoleController],
  providers: [
    RoleService,
    RoleRepository,
    RolePermissionsRepository,
    UpsertRoleTransaction,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [RoleService, RoleRepository, RolePermissionsRepository],
})
export class RolesModule {}
