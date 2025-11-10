import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {
    super(dataSource, User);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findOneWithRoleByEmail(email: string): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findOneByUserId(id: string): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findOneWithRolePermissionsById(id: string): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findOneWithRolePermissionById(id: string): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role', 'role.is_active = :isActive', {
        isActive: true,
      })
      .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
      .leftJoinAndSelect(
        'rolePermissions.permission',
        'permission',
        'permission.is_active = :isActive',
        { isActive: true },
      )
      .where('user.id = :id', { id })

      .getOne();
  }

  async findUsersByCondition(
    skip: number,
    take: number,
  ): Promise<[User[], number]> {
    return await this.createQueryBuilder('user')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }
}
