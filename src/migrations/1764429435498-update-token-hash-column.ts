import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTokenHashColumn1764429435498 implements MigrationInterface {
  name = 'UpdateTokenHashColumn1764429435498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_021e2c9d9dca9f0885e8d738326"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_b75c92ef36f432fe68ec300a7d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_f32b1cb14a9920477bcfd63df2c"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "level"`);
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "UQ_a7838d2ba25be1342091b6695f1" UNIQUE ("token_hash")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "UQ_a7838d2ba25be1342091b6695f1"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" ADD "level" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_f32b1cb14a9920477bcfd63df2c" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_b75c92ef36f432fe68ec300a7d4" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_021e2c9d9dca9f0885e8d738326" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
