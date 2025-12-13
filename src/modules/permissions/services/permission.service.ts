import { plainToInstance } from 'class-transformer';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PaginatedMetaDto } from 'src/shared/dtos/paginate.dto';
import {
  PermissionListingDto,
  PermissionListingReqDto,
} from '../dtos/permission-listing.dto';
import { PermissionDto } from '../dtos/permission.dto';
import { PermissionRepository } from '../repositories/permission.repository';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getPermissions(
    query: PermissionListingReqDto,
  ): Promise<PermissionListingDto> {
    const [items, total] = await this.permissionRepository.findAll(query);
    const response = new PermissionListingDto(
      new PaginatedMetaDto(query, total),
      query.keyword,
      query.filter,
      query.order,
    );
    response.items = plainToInstance(PermissionDto, items);
    return response;
  }

  async findOne(id: string): Promise<PermissionDto> {
    const permission = await this.permissionRepository.findById(id);

    if (!permission) {
      throw new BadRequestException('Permission not found');
    }

    return plainToInstance(PermissionDto, permission);
  }
}
