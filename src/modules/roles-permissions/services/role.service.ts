import { plainToInstance } from 'class-transformer';
import { Injectable, Logger } from '@nestjs/common';
import { RoleWithPermissionsDto } from '../dtos/role.dto';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(private readonly roleRepository: RoleRepository) {}

  async getRoles(): Promise<RoleWithPermissionsDto[]> {
    const roles = await this.roleRepository.findAllWithPermissions();
    return plainToInstance(RoleWithPermissionsDto, roles);
  }
}
