import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { EntityManager } from 'typeorm';
import { RolePermissions } from '../entities/role-permissions.entity';

@Injectable()
export class RolePermissionsRepository extends BaseRepository<RolePermissions> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(RolePermissions, entityManager);
  }
}
