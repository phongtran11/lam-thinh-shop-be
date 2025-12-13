import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PermissionListingReqDto } from '../dtos/permission-listing.dto';
import { Permission } from '../entities/permission.entity';
import { Permissions } from '../types/permission.type';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {
    super(Permission, dataSource.createEntityManager());
  }

  async findPermissionNamesByUserId(userId: string): Promise<Permission[]> {
    return await this.createQueryBuilder('permission')
      .innerJoin('permission.rolePermissions', 'rolePermissions')
      .innerJoin('rolePermissions.role', 'role')
      .innerJoin('role.users', 'user')
      .where('user.id = :userId', { userId })
      .select('permission.name')
      .getMany();
  }

  async findAll(
    query: PermissionListingReqDto,
  ): Promise<[Permission[], number]> {
    const { filter, order, keyword } = query;

    const qb = this.createQueryBuilder('permission');

    if (keyword) {
      qb.andWhere('permission.name ILIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    if (filter?.name) {
      qb.andWhere('permission.name = :name', { name: filter.name });
    }

    if (order?.name) {
      qb.orderBy('permission.name', order.name);
    }

    qb.skip(query.skip).take(query.take);

    return await qb.getManyAndCount();
  }

  async findByName(name: Permissions): Promise<Permission | null> {
    return await this.findOne({ where: { name } });
  }

  async findById(id: string): Promise<Permission | null> {
    return await this.findOne({ where: { id } });
  }
}
