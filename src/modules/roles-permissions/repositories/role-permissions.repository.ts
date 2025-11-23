import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RolePermissions } from '../entities/role-permissions.entity';

@Injectable()
export class RolePermissionsRepository extends Repository<RolePermissions> {
  constructor(protected dataSource: DataSource) {
    super(RolePermissions, dataSource.createEntityManager());
  }
}
