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
}
