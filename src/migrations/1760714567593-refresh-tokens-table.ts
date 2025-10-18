import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefreshTokensTable1760714567593 implements MigrationInterface {
  name = 'RefreshTokensTable1760714567593';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token_hash" character varying(60) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "is_revoked" boolean NOT NULL DEFAULT false, "revoked_at" TIMESTAMP, "revoke_reason" character varying(50), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a7838d2ba25be1342091b6695f1" UNIQUE ("token_hash"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")); COMMENT ON COLUMN "refresh_tokens"."user_id" IS 'The ID of the user associated with the refresh token'; COMMENT ON COLUMN "refresh_tokens"."token_hash" IS 'The hashed value of the refresh token'; COMMENT ON COLUMN "refresh_tokens"."expires_at" IS 'The expiration date and time of the refresh token'; COMMENT ON COLUMN "refresh_tokens"."is_revoked" IS 'Indicates whether the refresh token has been revoked'; COMMENT ON COLUMN "refresh_tokens"."revoked_at" IS 'The date and time when the refresh token was revoked'; COMMENT ON COLUMN "refresh_tokens"."revoke_reason" IS 'The reason for revoking the refresh token'`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
  }
}
