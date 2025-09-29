import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { BaseRepository } from 'src/shared/repositories/base.repository';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(Permission, entityManager);
  }

  async findByIds(ids: string[]): Promise<Permission[]> {
    return this.findByIds(ids);
  }

  async findOwnedPermissions(userId: string): Promise<Permission[]> {
    const qb = this.createQueryBuilder('permission')
      .leftJoin('permission.roles', 'role')
      .leftJoin('role.users', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('permission.isActive = :isActive', { isActive: true });
    this.buildQueryAudit('permission', qb);

    return qb.getMany();
  }
}
