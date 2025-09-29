import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';
import { RoleAdmin } from 'src/shared/decorators/roles.decorator';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(RolesGuard, PermissionsGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('seed')
  @RoleAdmin()
  async seedDefaultRoles(): Promise<{ message: string }> {
    await this.roleService.seedDefaultRoles();
    return { message: 'Default roles seeded successfully' };
  }
}
