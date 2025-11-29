import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { RolePermissions } from '../entities/role-permissions.entity';

@Injectable()
export class RolePermissionsRepository extends Repository<RolePermissions> {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {
    super(RolePermissions, dataSource.createEntityManager());
  }
}
