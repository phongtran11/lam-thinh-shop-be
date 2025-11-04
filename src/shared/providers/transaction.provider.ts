import { DataSource, QueryRunner } from 'typeorm';
import { BaseRepository } from '../repositories/base.repository';

/**
 * Base Transaction Class
 *
 * Features:
 * - Auto transaction handling (begin/commit/rollback)
 * - Auto set/clear manager for all repositories
 * - Error handling and rollback on failure
 *
 * Usage:
 * class RegisterTransaction extends BaseTransaction {
 *   constructor(dataSource, userRepo, tokenRepo) {
 *     super(dataSource);
 *     this.registerRepository(userRepo);
 *     this.registerRepository(tokenRepo);
 *   }
 *
 *   async register(input) {
 *     return this.execute(async () => {
 *       // All operations here are in transaction
 *     });
 *   }
 * }
 */
export abstract class BaseTransaction {
  /**
   * Query runner for transaction
   */
  private queryRunner: QueryRunner;

  /**
   * Track all repositories in this transaction
   */
  private repositories: BaseRepository<any>[] = [];

  constructor(protected dataSource: DataSource) {}

  /**
   * Begin transaction
   * Set manager for all repositories
   */
  private async begin(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    // Set transaction manager for all repositories
    this.repositories.forEach((repo) => {
      repo.setManager(this.queryRunner.manager);
    });
  }

  /**
   * Commit transaction
   * Clear manager from all repositories
   */
  private async commit(): Promise<void> {
    try {
      await this.queryRunner.commitTransaction();
    } finally {
      this.clearAllRepositories();
      await this.queryRunner.release();
    }
  }

  /**
   * Rollback transaction
   * Clear manager from all repositories
   */
  private async rollback(): Promise<void> {
    try {
      await this.queryRunner.rollbackTransaction();
    } finally {
      this.clearAllRepositories();
      await this.queryRunner.release();
    }
  }

  /**
   * Clear manager from all repositories
   */
  private clearAllRepositories(): void {
    this.repositories.forEach((repo) => {
      repo.clearManager();
    });
  }

  /**
   * Register repository to auto set/clear manager
   */
  protected registerRepository(repo: BaseRepository<any>): void {
    this.repositories.push(repo);
  }

  /**
   * Execute callback in transaction
   * Auto begin/commit/rollback
   */
  protected async transaction<T>(callback: () => Promise<T>): Promise<T> {
    await this.begin();
    try {
      const result = await callback();
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  /**
   * Abstract run method to be implemented by subclasses
   * Use this method to define transaction logic
   * Example implementation:
   * async execute(arg1: Type1, arg2: Type2): Promise<ReturnType> {
   *   return this.transaction(async () => {
   *     // Transactional operations here
   *   });
   * }
   * @param args
   */
  abstract execute(...args: any[]): Promise<any>;
}
