import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Role } from '../entities/role.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseRepository } from 'src/shared/repositories/base.repository';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(Role, entityManager);
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
}
