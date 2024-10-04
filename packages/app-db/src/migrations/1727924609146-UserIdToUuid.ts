import { MigrationInterface, QueryRunner } from "typeorm";

export class UserIdToUuid1727924609146 implements MigrationInterface {
    name = 'UserIdToUuid1727924609146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SavedPlace" DROP CONSTRAINT "FK_6322c0f084666f5060abf531dc1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" DROP CONSTRAINT "PK_6eff3269c664052b4682c70fe3d"`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" ADD CONSTRAINT "PK_1c505e64f8cb4bd6e3ab0c32608" PRIMARY KEY ("placeId")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6322c0f084666f5060abf531dc"`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" DROP CONSTRAINT "PK_1c505e64f8cb4bd6e3ab0c32608"`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" ADD CONSTRAINT "PK_6eff3269c664052b4682c70fe3d" PRIMARY KEY ("placeId", "userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_6322c0f084666f5060abf531dc" ON "SavedPlace" ("userId") `);
        await queryRunner.query(`ALTER TABLE "SavedPlace" ADD CONSTRAINT "FK_6322c0f084666f5060abf531dc1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SavedPlace" DROP CONSTRAINT "FK_6322c0f084666f5060abf531dc1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6322c0f084666f5060abf531dc"`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" DROP CONSTRAINT "PK_6eff3269c664052b4682c70fe3d"`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" ADD CONSTRAINT "PK_1c505e64f8cb4bd6e3ab0c32608" PRIMARY KEY ("placeId")`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_6322c0f084666f5060abf531dc" ON "SavedPlace" ("userId") `);
        await queryRunner.query(`ALTER TABLE "SavedPlace" DROP CONSTRAINT "PK_1c505e64f8cb4bd6e3ab0c32608"`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" ADD CONSTRAINT "PK_6eff3269c664052b4682c70fe3d" PRIMARY KEY ("userId", "placeId")`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" ADD CONSTRAINT "FK_6322c0f084666f5060abf531dc1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
