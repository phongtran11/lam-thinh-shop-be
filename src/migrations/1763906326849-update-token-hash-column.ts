import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTokenHashColumn1763906326849 implements MigrationInterface {
  name = 'UpdateTokenHashColumn1763906326849';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "UQ_a7838d2ba25be1342091b6695f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ALTER COLUMN "token_hash" TYPE text`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "refresh_tokens"."token_hash" IS 'The hashed value of the refresh token'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."email" IS 'The email of the user'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."password" IS 'The hashed password of the user'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."first_name" IS 'The first name of the user'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."last_name" IS 'The last name of the user'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."phone_number" IS 'The phone number of the user'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."avatar" IS 'The avatar of the user'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."role_id" IS 'The role ID of the user'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "users"."role_id" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."avatar" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."phone_number" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."last_name" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."first_name" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."password" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."email" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "refresh_tokens"."token_hash" IS 'The hashed value of the refresh token'`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ALTER COLUMN "token_hash" TYPE character varying(64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "UQ_a7838d2ba25be1342091b6695f1" UNIQUE ("token_hash")`,
    );
  }
}
