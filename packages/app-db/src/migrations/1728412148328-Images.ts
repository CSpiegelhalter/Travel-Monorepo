import { MigrationInterface, QueryRunner } from "typeorm";

export class Images1728412148328 implements MigrationInterface {
    name = 'Images1728412148328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "src" character varying NOT NULL, "placeId" integer, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_9ad0d872c1a54866d27b469a4e8" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_9ad0d872c1a54866d27b469a4e8"`);
        await queryRunner.query(`ALTER TABLE "place" ADD "images" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
