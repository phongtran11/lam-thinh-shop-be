import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
  constructor(protected dataSource: DataSource) {
    super(Permission, dataSource.createEntityManager());
  }

  async findAll(): Promise<Permission[]> {
    return await this.createQueryBuilder('permission').getMany();
  }
}
