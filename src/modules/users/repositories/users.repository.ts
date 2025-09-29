import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';
import { BaseRepository } from 'src/shared/repositories/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(User, entityManager, entityManager.queryRunner);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const qb = this.createQueryBuilder('user').select([
      'user.id',
      'user.email',
      'user.password',
      'user.firstName',
      'user.lastName',
      'user.phoneNumber',
      'user.avatar',
      'user.roleName',
      'user.createdAt',
      'user.createdBy',
      'user.updatedAt',
      'user.updatedBy',
      'user.deletedAt',
      'user.deletedBy',
    ]);

    this.buildQueryAudit('user', qb);

    return qb.where('user.email = :email', { email }).getOne();
  }

  async findOneByUserId(id: string): Promise<User | null> {
    const qb = this.createQueryBuilder('user').select([
      'user.id',
      'user.email',
      'user.firstName',
      'user.lastName',
      'user.phoneNumber',
      'user.avatar',
      'user.roleName',
      'user.createdAt',
      'user.createdBy',
      'user.updatedAt',
      'user.updatedBy',
      'user.deletedAt',
      'user.deletedBy',
    ]);

    this.buildQueryAudit('user', qb);

    return qb.where('user.id = :id', { id }).getOne();
  }

  async findOneWithRolePermissionsById(id: string): Promise<User | null> {
    const qb = this.createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.phoneNumber',
        'user.roleName',
        'user.createdAt',
        'user.createdBy',
        'user.updatedAt',
        'user.updatedBy',
        'user.deletedAt',
        'user.deletedBy',
      ])
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('user.id = :id', { id });

    this.buildQueryAudit('user', qb);

    return qb.getOne();
  }
}
