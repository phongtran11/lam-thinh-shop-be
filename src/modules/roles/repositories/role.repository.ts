import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { RoleListingReqDto } from '../dtos/role-listing.dto';
import { Role } from '../entities/role.entity';
import { Roles } from '../types/role.type';
import { InsertResult } from 'typeorm/browser';
import { UpdateResult } from 'typeorm/browser';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {
    super(Role, dataSource.createEntityManager());
  }

  async findAll(query: RoleListingReqDto): Promise<[Role[], number]> {
    const { filter, order, keyword } = query;

    const qb = this.createQueryBuilder('role');

    if (keyword) {
      qb.andWhere('role.name ILIKE :keyword OR role.displayName ILIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    if (filter?.name) {
      qb.andWhere('role.name = :name', { name: filter.name });
    }

    if (order?.name) {
      qb.orderBy('role.name', order.name);
    }

    qb.skip(query.skip).take(query.take);

    return await qb.getManyAndCount();
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

  async findById(id: string): Promise<Role | null> {
    return await this.findOne({ where: { id } });
  }

  async insertRole(role: Role): Promise<InsertResult> {
    return this.insert(role)
  }

  async updateRole(id: string, updatingRole: Role): Promise<UpdateResult> {
    return this.update({
      id
    }, updatingRole)
  }

  async deleteRole(id: string): Promise<boolean> {
    const role = await this.findById(id);
    if (!role) {
      return false;
    }

    await this.createQueryBuilder()
      .update(Role)
      .set({ isActive: false })
      .where('id = :id', { id })
      .execute();
      
    return true;
  }
}
