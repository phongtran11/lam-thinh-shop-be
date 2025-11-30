import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTokenHashDataType1760840562803
  implements MigrationInterface
{
  name = 'ChangeTokenHashDataType1760840562803';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ALTER COLUMN "token_hash" TYPE character varying(64)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "refresh_tokens"."token_hash" IS 'The hashed value of the refresh token (SHA-256)'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ALTER COLUMN "token_hash" TYPE character varying(60)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "refresh_tokens"."token_hash" IS 'The hashed value of the refresh token'`,
    );
  }
}
