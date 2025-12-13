import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './controllers/permission.controller';
import { Permission } from './entities/permission.entity';
import { PermissionsGuard } from './guards/permissions.guard';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionService } from './services/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionsController],
  providers: [
    PermissionService,
    PermissionRepository,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [PermissionService, PermissionRepository],
})
export class PermissionsModule {}
