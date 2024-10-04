import { MigrationInterface, QueryRunner } from "typeorm";

export class EditRequestv21727979819550 implements MigrationInterface {
    name = 'EditRequestv21727979819550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "edit_request" ("id" SERIAL NOT NULL, "requestedChanges" jsonb NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "adminComments" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "placeId" integer, "userId" uuid, CONSTRAINT "PK_b8b378e91123f28ddaeee3a77ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "edit_request" ADD CONSTRAINT "FK_5dd43ad5aa4b8dcd0b4540c6c4b" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "edit_request" ADD CONSTRAINT "FK_a320d9cc8622b8bc7bdd9cd929b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "edit_request" DROP CONSTRAINT "FK_a320d9cc8622b8bc7bdd9cd929b"`);
        await queryRunner.query(`ALTER TABLE "edit_request" DROP CONSTRAINT "FK_5dd43ad5aa4b8dcd0b4540c6c4b"`);
        await queryRunner.query(`DROP TABLE "edit_request"`);
    }

}
