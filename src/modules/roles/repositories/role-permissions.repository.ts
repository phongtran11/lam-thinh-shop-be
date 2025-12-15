import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { RolePermissions } from 'src/modules/roles/entities/role-permissions.entity';
import { InsertResult } from 'typeorm/browser';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class RolePermissionsRepository extends Repository<RolePermissions> {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {
    super(RolePermissions, dataSource.createEntityManager());
  }
  
  async insertRolePermissions(
    rolePermissions: RolePermissions[],
  ): Promise<InsertResult> {
    return this.insert(rolePermissions);
  }

  async deleteAllByRoleId(
    roleId: string
  ): Promise<DeleteResult> {
    return this.delete({
      roleId
    })
  }
}

