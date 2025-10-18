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

  async findAll(): Promise<Permission[]> {
    return await this.createQueryBuilder('permission').getMany();
  }
}
