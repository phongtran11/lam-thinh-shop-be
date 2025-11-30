import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePasswordColumn1763906933014 implements MigrationInterface {
  name = 'UpdatePasswordColumn1763906933014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" TYPE text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" TYPE character varying(60)`,
    );
  }
}
