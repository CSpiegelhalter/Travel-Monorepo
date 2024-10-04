import { MigrationInterface, QueryRunner } from "typeorm";

export class JoinTableUserPlace1727911644621 implements MigrationInterface {
    name = 'JoinTableUserPlace1727911644621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "SavedPlace" ("userId" integer NOT NULL, "placeId" integer NOT NULL, CONSTRAINT "PK_6eff3269c664052b4682c70fe3d" PRIMARY KEY ("userId", "placeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6322c0f084666f5060abf531dc" ON "SavedPlace" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1c505e64f8cb4bd6e3ab0c3260" ON "SavedPlace" ("placeId") `);
        await queryRunner.query(`ALTER TABLE "SavedPlace" ADD CONSTRAINT "FK_6322c0f084666f5060abf531dc1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" ADD CONSTRAINT "FK_1c505e64f8cb4bd6e3ab0c32608" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SavedPlace" DROP CONSTRAINT "FK_1c505e64f8cb4bd6e3ab0c32608"`);
        await queryRunner.query(`ALTER TABLE "SavedPlace" DROP CONSTRAINT "FK_6322c0f084666f5060abf531dc1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c505e64f8cb4bd6e3ab0c3260"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6322c0f084666f5060abf531dc"`);
        await queryRunner.query(`DROP TABLE "SavedPlace"`);
    }

}
