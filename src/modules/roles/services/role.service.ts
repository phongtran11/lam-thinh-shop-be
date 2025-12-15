import { plainToInstance } from 'class-transformer';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PaginatedMetaDto } from 'src/shared/dtos/paginate.dto';
import { RoleListingDto, RoleListingReqDto } from '../dtos/role-listing.dto';
import { RoleDto, RoleRequestDto, RoleWithPermissionsDto } from '../dtos/role.dto';
import { RoleRepository } from '../repositories/role.repository';
import { UpsertRoleTransaction } from '../transactions/upsert-role.transaction';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly upsertRoleTransaction: UpsertRoleTransaction,
  ) {}

  async getRoles(query: RoleListingReqDto): Promise<RoleListingDto> {
    const [items, total] = await this.roleRepository.findAll(query);
    const response = new RoleListingDto(
      new PaginatedMetaDto(query, total),
      query.keyword,
      query.filter,
      query.order,
    );
    response.items = plainToInstance(RoleDto, items);
    return response;
  }

  async getRolesWithPermissions(): Promise<RoleWithPermissionsDto[]> {
    const roles = await this.roleRepository.findAllWithPermissions();
    return plainToInstance(RoleWithPermissionsDto, roles);
  }

  async findOne(id: string): Promise<RoleDto> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    return plainToInstance(RoleDto, role);
  }

  async create(dto: RoleRequestDto): Promise<RoleDto> {
    const role = await this.upsertRoleTransaction.execute(dto);
    return plainToInstance(RoleDto, role);
  }

  async update(id: string, dto: RoleRequestDto): Promise<RoleDto> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    await this.upsertRoleTransaction.execute(dto, id);

    return await this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.roleRepository.deleteRole(id);

    if (!deleted) {
      throw new BadRequestException('Role not found');
    }
  }
}
