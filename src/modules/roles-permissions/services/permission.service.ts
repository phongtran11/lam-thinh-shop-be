import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PermissionDto } from '../dtos/permission.dto';
import { PermissionRepository } from '../repositories/permission.repository';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getPermissions(): Promise<PermissionDto[]> {
    const permissions = await this.permissionRepository.findAll();

    return plainToInstance(PermissionDto, permissions);
  }
}
