import { Injectable, Logger } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { PermissionRepository } from '../repositories/permission.repository';
import { plainToInstance } from 'class-transformer';
import { RoleDto } from '../dto/role.dto';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async getRoles() {
    const roles = await this.roleRepository.findAll();

    return plainToInstance(RoleDto, roles);
  }
}
