import { MigrationInterface, QueryRunner } from "typeorm";

export class HasBeenPlace1729294791944 implements MigrationInterface {
    name = 'HasBeenPlace1729294791944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "UserHasBeen" ("userId" uuid NOT NULL, "placeId" integer NOT NULL, CONSTRAINT "PK_dbcce83816a3032689dc94a7019" PRIMARY KEY ("userId", "placeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3048d29c75a782887a84812c5c" ON "UserHasBeen" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_107d4b33c91d60b9f903f18755" ON "UserHasBeen" ("placeId") `);
        await queryRunner.query(`ALTER TABLE "UserHasBeen" ADD CONSTRAINT "FK_3048d29c75a782887a84812c5cf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UserHasBeen" ADD CONSTRAINT "FK_107d4b33c91d60b9f903f18755a" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserHasBeen" DROP CONSTRAINT "FK_107d4b33c91d60b9f903f18755a"`);
        await queryRunner.query(`ALTER TABLE "UserHasBeen" DROP CONSTRAINT "FK_3048d29c75a782887a84812c5cf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_107d4b33c91d60b9f903f18755"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3048d29c75a782887a84812c5c"`);
        await queryRunner.query(`DROP TABLE "UserHasBeen"`);
    }

}
