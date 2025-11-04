import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { DataSource } from 'typeorm';
import { ERoles } from 'src/shared/constants/role.constant';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {
    super(dataSource, Role);
  }

  async findAll(): Promise<Role[]> {
    return await this.createQueryBuilder('role').getMany();
  }

  async findRoleByUserId(userId: string): Promise<Role | null> {
    return await this.createQueryBuilder('role')
      .innerJoin('role.users', 'user')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  async findOneByName(name: ERoles): Promise<Role | null> {
    return await this.createQueryBuilder('role')
      .where('role.name = :name', { name })
      .getOne();
  }
}
