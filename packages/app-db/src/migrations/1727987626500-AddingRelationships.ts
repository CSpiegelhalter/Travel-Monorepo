import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingRelationships1727987626500 implements MigrationInterface {
    name = 'AddingRelationships1727987626500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "place_edited_by_users_user" ("placeId" integer NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_90e9641fa31ebc686f395d98121" PRIMARY KEY ("placeId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_90ed7c81403b3dbc93084adc00" ON "place_edited_by_users_user" ("placeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bb42464bcb446a86596d03c7c5" ON "place_edited_by_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "place_edited_by_users_user" ADD CONSTRAINT "FK_90ed7c81403b3dbc93084adc002" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "place_edited_by_users_user" ADD CONSTRAINT "FK_bb42464bcb446a86596d03c7c50" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place_edited_by_users_user" DROP CONSTRAINT "FK_bb42464bcb446a86596d03c7c50"`);
        await queryRunner.query(`ALTER TABLE "place_edited_by_users_user" DROP CONSTRAINT "FK_90ed7c81403b3dbc93084adc002"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb42464bcb446a86596d03c7c5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_90ed7c81403b3dbc93084adc00"`);
        await queryRunner.query(`DROP TABLE "place_edited_by_users_user"`);
    }

}
