import { Injectable, Logger } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { plainToInstance } from 'class-transformer';
import { RoleWithPermissionsDto } from '../dto/role.dto';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(private readonly roleRepository: RoleRepository) {}

  async getRoles(): Promise<RoleWithPermissionsDto[]> {
    const roles = await this.roleRepository.findAllWithPermissions();
    return plainToInstance(RoleWithPermissionsDto, roles);
  }
}
