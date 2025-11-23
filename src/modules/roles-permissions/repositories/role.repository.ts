import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ERoles } from 'src/shared/constants/role.constant';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(protected dataSource: DataSource) {
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

  async findOneByName(name: ERoles): Promise<Role | null> {
    return await this.createQueryBuilder('role')
      .where('role.name = :name', { name })
      .andWhere('role.isActive = :isActive', { isActive: true })
      .getOne();
  }
}
