import { User } from 'src/modules/users/entities/user.entity';
import {
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  constructor(
    target: EntityTarget<T>,
    manager: EntityManager,
    queryRunner?: QueryRunner,
  ) {
    super(target, manager, queryRunner);
  }

  buildQueryAudit(
    alias: string,
    qb: SelectQueryBuilder<T>,
  ): SelectQueryBuilder<T> {
    return qb
      .leftJoinAndMapOne(
        `${alias}.createdByUser`,
        User,
        'createdByUser',
        `${alias}.createdBy = createdByUser.id`,
      )
      .leftJoinAndMapOne(
        `${alias}.updatedByUser`,
        User,
        'updatedByUser',
        `${alias}.updatedBy = updatedByUser.id`,
      )
      .leftJoinAndMapOne(
        `${alias}.deletedByUser`,
        User,
        'deletedByUser',
        `${alias}.deletedBy = deletedByUser.id`,
      );
  }
}
