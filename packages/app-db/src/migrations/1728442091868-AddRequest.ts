import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRequest1728442091868 implements MigrationInterface {
    name = 'AddRequest1728442091868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."add_request_status_enum" AS ENUM('pending', 'accepted', 'declined')`);
        await queryRunner.query(`CREATE TABLE "add_request" ("id" SERIAL NOT NULL, "placeData" jsonb NOT NULL, "status" "public"."add_request_status_enum" NOT NULL DEFAULT 'pending', "additionalComments" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "placeId" integer, CONSTRAINT "PK_b8323343cdfd0461f1a2b09086c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "add_request" ADD CONSTRAINT "FK_7a21e8f593c0e3a327cf06d2ab0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "add_request" ADD CONSTRAINT "FK_f50a2c6a750921695dd0f372f5d" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "add_request" DROP CONSTRAINT "FK_f50a2c6a750921695dd0f372f5d"`);
        await queryRunner.query(`ALTER TABLE "add_request" DROP CONSTRAINT "FK_7a21e8f593c0e3a327cf06d2ab0"`);
        await queryRunner.query(`DROP TABLE "add_request"`);
        await queryRunner.query(`DROP TYPE "public"."add_request_status_enum"`);
    }

}
