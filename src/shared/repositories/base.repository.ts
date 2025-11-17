import {
  DataSource,
  DeepPartial,
  DeleteResult,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  ObjectLiteral,
  Repository,
  SaveOptions,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';
import { InternalServerErrorException } from '@nestjs/common';

export class BaseRepository<
  Entity extends ObjectLiteral,
> extends Repository<Entity> {
  private txManager?: EntityManager;

  constructor(
    protected dataSource: DataSource,
    protected entity: EntityTarget<Entity>,
  ) {
    super(entity, dataSource.createEntityManager());
  }

  setManager(manager: EntityManager): void {
    this.txManager = manager;
  }

  clearManager(): void {
    this.txManager = undefined;
  }

  protected getRepo(): Repository<Entity> {
    if (!this.txManager) {
      throw new InternalServerErrorException('Transaction manager is not set.');
    }

    return this.txManager.getRepository(this.entity);
  }

  find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    if (this.txManager) {
      return this.getRepo().find(options);
    }
    return super.find(options);
  }

  findOne(options: FindOneOptions<Entity>): Promise<Entity | null> {
    if (this.txManager) {
      return this.getRepo().findOne(options);
    }
    return super.findOne(options);
  }

  findOneBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<Entity | null> {
    if (this.txManager) {
      return this.getRepo().findOneBy(where);
    }
    return super.findOneBy(where);
  }

  createQueryBuilder(alias: string): SelectQueryBuilder<Entity> {
    // Use manager directly when in transaction to avoid infinite recursion
    if (this.txManager) {
      return this.txManager.createQueryBuilder(this.entity, alias);
    }
    return super.createQueryBuilder(alias);
  }

  insert(
    entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
  ): Promise<InsertResult> {
    if (this.txManager) {
      return this.txManager.insert(this.entity, entity);
    }
    return super.insert(entity);
  }

  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & {
      reload: false;
    },
  ): Promise<T[]>;
  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;
  save<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & {
      reload: false;
    },
  ): Promise<T>;
  save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;

  save(
    entity: Entity | Entity[],
    options?: { reload?: boolean },
  ): Promise<Entity | Entity[]> {
    if (this.txManager) {
      if (Array.isArray(entity)) {
        return this.getRepo().save<Entity>(entity, options);
      }
      return this.getRepo().save<Entity>(entity, options);
    }
    if (Array.isArray(entity)) {
      return super.save<Entity>(entity, options);
    }
    return super.save<Entity>(entity, options);
  }

  update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | FindOptionsWhere<Entity>
      | FindOptionsWhere<Entity>[],
    partialEntity: Partial<Entity>,
  ): Promise<UpdateResult> {
    if (this.txManager) {
      return this.getRepo().update(criteria, partialEntity);
    }
    return super.update(criteria, partialEntity);
  }

  delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | FindOptionsWhere<Entity>
      | FindOptionsWhere<Entity>[],
  ): Promise<DeleteResult> {
    if (this.txManager) {
      return this.getRepo().delete(criteria);
    }
    return super.delete(criteria);
  }

  softDelete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | FindOptionsWhere<Entity>
      | FindOptionsWhere<Entity>[],
  ): Promise<UpdateResult> {
    if (this.txManager) {
      return this.getRepo().softDelete(criteria);
    }
    return super.softDelete(criteria);
  }

  softRemove<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & {
      reload: false;
    },
  ): Promise<T[]>;
  softRemove<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;
  softRemove<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & {
      reload: false;
    },
  ): Promise<T>;
  softRemove<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;
  softRemove(
    entity: Entity | Entity[],
    options?: { reload?: boolean },
  ): Promise<Entity | Entity[]> {
    if (this.txManager) {
      if (Array.isArray(entity)) {
        return this.getRepo().softRemove(entity, options);
      }
      return this.getRepo().softRemove(entity, options);
    }
    if (Array.isArray(entity)) {
      return super.softRemove(entity, options);
    }
    return super.softRemove(entity, options);
  }

  restore(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | FindOptionsWhere<Entity>
      | FindOptionsWhere<Entity>[],
  ): Promise<UpdateResult> {
    if (this.txManager) {
      return this.getRepo().restore(criteria);
    }
    return super.restore(criteria);
  }

  recover<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & {
      reload: false;
    },
  ): Promise<T[]>;

  recover<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;

  recover<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & {
      reload: false;
    },
  ): Promise<T>;

  recover<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;
  recover(
    entity: Entity | Entity[],
    options?: { reload?: boolean },
  ): Promise<Entity | Entity[]> {
    if (this.txManager) {
      if (Array.isArray(entity)) {
        return this.getRepo().recover(entity, options);
      }
      return this.getRepo().recover(entity, options);
    }
    if (Array.isArray(entity)) {
      return super.recover(entity, options);
    }
    return super.recover(entity, options);
  }

  remove(entity: Entity): Promise<Entity>;
  remove(entity: Entity[]): Promise<Entity[]>;
  remove(entity: Entity | Entity[]): Promise<Entity | Entity[]> {
    if (this.txManager) {
      if (Array.isArray(entity)) {
        return this.getRepo().remove(entity);
      }
      return this.getRepo().remove(entity);
    }
    if (Array.isArray(entity)) {
      return super.remove(entity);
    }
    return super.remove(entity);
  }

  count(options?: FindManyOptions<Entity>): Promise<number> {
    if (this.txManager) {
      return this.getRepo().count(options);
    }
    return super.count(options);
  }

  countBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<number> {
    if (this.txManager) {
      return this.getRepo().countBy(where);
    }
    return super.countBy(where);
  }

  exists(options?: FindManyOptions<Entity>): Promise<boolean> {
    if (this.txManager) {
      return this.getRepo().exists(options);
    }
    return super.exists(options);
  }

  existsBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<boolean> {
    if (this.txManager) {
      return this.getRepo().existsBy(where);
    }
    return super.existsBy(where);
  }

  findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]> {
    if (this.txManager) {
      return this.getRepo().findAndCount(options);
    }
    return super.findAndCount(options);
  }

  findAndCountBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<[Entity[], number]> {
    if (this.txManager) {
      return this.getRepo().findAndCountBy(where);
    }
    return super.findAndCountBy(where);
  }

  findOneOrFail(options: FindOneOptions<Entity>): Promise<Entity> {
    if (this.txManager) {
      return this.getRepo().findOneOrFail(options);
    }
    return super.findOneOrFail(options);
  }

  findOneByOrFail(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<Entity> {
    if (this.txManager) {
      return this.getRepo().findOneByOrFail(where);
    }
    return super.findOneByOrFail(where);
  }

  increment(
    conditions: FindOptionsWhere<Entity>,
    propertyPath: string,
    value: number | string,
  ): Promise<UpdateResult> {
    if (this.txManager) {
      return this.getRepo().increment(conditions, propertyPath, value);
    }
    return super.increment(conditions, propertyPath, value);
  }

  decrement(
    conditions: FindOptionsWhere<Entity>,
    propertyPath: string,
    value: number | string,
  ): Promise<UpdateResult> {
    if (this.txManager) {
      return this.getRepo().decrement(conditions, propertyPath, value);
    }
    return super.decrement(conditions, propertyPath, value);
  }

  clear(): Promise<void> {
    if (this.txManager) {
      return this.getRepo().clear();
    }
    return super.clear();
  }
}
