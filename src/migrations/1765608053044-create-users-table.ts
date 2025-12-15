import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1765608053044 implements MigrationInterface {
  name = 'CreateUsersTable1765608053044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "email" character varying(255) NOT NULL, "password" text NOT NULL, "first_name" character varying(64), "last_name" character varying(64), "phone_number" character varying(20), "avatar" character varying(255), "role_id" uuid NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."email" IS 'The email of the user'; COMMENT ON COLUMN "users"."password" IS 'The hashed password of the user'; COMMENT ON COLUMN "users"."first_name" IS 'The first name of the user'; COMMENT ON COLUMN "users"."last_name" IS 'The last name of the user'; COMMENT ON COLUMN "users"."phone_number" IS 'The phone number of the user'; COMMENT ON COLUMN "users"."avatar" IS 'The avatar of the user'; COMMENT ON COLUMN "users"."role_id" IS 'The role ID of the user'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
