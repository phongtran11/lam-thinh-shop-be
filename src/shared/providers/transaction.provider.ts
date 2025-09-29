import { Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

export abstract class TransactionProvider<Input extends any[], Output> {
  private readonly logger = new Logger(TransactionProvider.name);

  constructor(protected readonly dataSource: DataSource) {}

  protected abstract transaction(...input: Input): Promise<Output>;

  protected abstract initRepository(entityManager: EntityManager): void;

  async execute(...input: Input): Promise<Output> {
    const queryRunner = this.dataSource.createQueryRunner();
    const entityManager = queryRunner.manager;

    // Init repositories with transaction-aware EntityManager
    this.initRepository(entityManager);

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const result = await this.transaction(...input);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
