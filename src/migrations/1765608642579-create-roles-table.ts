import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolesTable1765608642579 implements MigrationInterface {
  name = 'CreateRolesTable1765608642579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, "name" character varying(32) NOT NULL, "display_name" character varying(64) NOT NULL, "description" character varying(255), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")); COMMENT ON COLUMN "roles"."name" IS 'Role identifier'; COMMENT ON COLUMN "roles"."display_name" IS 'Human-readable role name'; COMMENT ON COLUMN "roles"."description" IS 'Role description'; COMMENT ON COLUMN "roles"."is_active" IS 'Is role active'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`,
    );
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
