import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { RolePermissions } from '../entities/role-permissions.entity';

@Injectable()
export class RolePermissionsRepository extends BaseRepository<RolePermissions> {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {
    super(dataSource, RolePermissions);
  }
}
