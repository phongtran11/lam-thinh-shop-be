import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Roles } from '../types/role.type';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {
    super(Role, dataSource.createEntityManager());
  }

  async findAll(): Promise<Role[]> {
    return await this.createQueryBuilder('role')
      .where('role.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async findAllWithPermissions(): Promise<Role[]> {
    return await this.createQueryBuilder('role')
      .select(['role', 'rolePermissions', 'permission'])
      .leftJoin('role.rolePermissions', 'rolePermissions')
      .leftJoin(
        'rolePermissions.permission',
        'permission',
        'permission.isActive = :isActive',
        { isActive: true },
      )
      .where('role.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async findRoleByUserId(userId: string): Promise<Role | null> {
    return await this.createQueryBuilder('role')
      .innerJoin('role.users', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('role.isActive = :isActive', { isActive: true })
      .getOne();
  }

  async findOneByName(name: Roles): Promise<Role | null> {
    return await this.createQueryBuilder('role')
      .where('role.name = :name', { name })
      .andWhere('role.isActive = :isActive', { isActive: true })
      .getOne();
  }
}
