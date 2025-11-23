import { DataSource, EntityManager, QueryRunner } from 'typeorm';

/**
 * Base Transaction Class
 *
 * Features:
 * - Auto transaction handling (begin/commit/rollback)
 * - Error handling and rollback on failure
 *
 * Usage:
 * class ExampleTransaction extends BaseTransaction {
 *   constructor(dataSource, userRepo, tokenRepo) {
 *     super(dataSource);
 *   }
 *
 *   async execute(input) {
 *     return this.transaction(async (em: EntityManager) => {
 *       // All DB operations below run inside a single transaction
 *       const fooRepo = em.getRepository(EntityFoo);
 *       const barRepo = em.getRepository(EntityBar);
 *       // …your business logic…
 *       return result;
 *     });
 *   }
 * }
 */
export abstract class BaseTransaction {
  private queryRunner: QueryRunner;

  constructor(protected readonly dataSource: DataSource) {}

  /**
   * Begin transaction
   * Set manager for all repositories
   */
  private async begin(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  /**
   * Execute callback in transaction
   * Auto begin/commit/rollback
   */
  protected async transaction<T>(
    callback: (em: EntityManager) => Promise<T>,
  ): Promise<T> {
    try {
      await this.begin();
      const result = await callback(this.queryRunner.manager);
      await this.queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await this.queryRunner.release();
    }
  }

  /**
   * - Abstract run method to be implemented by subclasses
   * - Use this method to define transaction logic
   * @param args
   */
  abstract execute(...args: any[]): Promise<any>;
}
