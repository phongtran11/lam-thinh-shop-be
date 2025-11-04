import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { BaseRepository } from 'src/shared/repositories/base.repository';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {
    super(dataSource, Permission);
  }

  async findAll(): Promise<Permission[]> {
    return await this.createQueryBuilder('permission').getMany();
  }
}
