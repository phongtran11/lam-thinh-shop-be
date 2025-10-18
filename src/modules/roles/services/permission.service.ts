import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionDto } from '../dto/permission.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getPermissions(): Promise<PermissionDto[]> {
    const permissions = await this.permissionRepository.findAll();

    return plainToInstance(PermissionDto, permissions);
  }
}
