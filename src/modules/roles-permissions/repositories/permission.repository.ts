import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {
    super(Permission, dataSource.createEntityManager());
  }

  async findAll(): Promise<Permission[]> {
    return await this.createQueryBuilder('permission').getMany();
  }
}
