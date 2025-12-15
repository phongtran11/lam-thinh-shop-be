import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseTransaction } from 'src/shared/providers/transaction.provider';
import { RoleRequestDto } from '../dtos/role.dto';
import { RolePermissions } from '../entities/role-permissions.entity';
import { Role } from '../entities/role.entity';
import { RolePermissionsRepository } from '../repositories/role-permissions.repository';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class UpsertRoleTransaction extends BaseTransaction {
  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
    protected readonly roleRepository: RoleRepository,
    protected readonly rolePermissionsRepository: RolePermissionsRepository,
  ) {
    super(dataSource);
  }

  async execute(dto: RoleRequestDto, roleId?: string): Promise<Role> {
    return this.transaction(async (em) => {
      const roleRepository = em.withRepository(this.roleRepository);
      const rolePermissionsRepository = em.withRepository(
        this.rolePermissionsRepository,
      );

      const { permissions,...roleDto} = dto

      // 1. Prepare Role entity
      const role = this.roleRepository.create(roleDto)

      if (roleId) {
        role.id = roleId;
        await roleRepository.updateRole(roleId, role);
      } else {
       await roleRepository.insertRole(role);
      }
      

      if (dto.permissions && dto.permissions.length > 0) {
        const rolePermissions = dto.permissions.map((permissionId) => {
          const rp = new RolePermissions();
          rp.roleId = role.id
          rp.permissionId = permissionId;
          return rp;
        });

        if (roleId) {
          await rolePermissionsRepository.deleteAllByRoleId(roleId);
        }

        await rolePermissionsRepository.insertRolePermissions(rolePermissions);
      }

      return role;
    });
  }
}
