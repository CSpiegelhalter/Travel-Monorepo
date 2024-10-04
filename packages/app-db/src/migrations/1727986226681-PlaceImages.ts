import { MigrationInterface, QueryRunner } from "typeorm";

export class PlaceImages1727986226681 implements MigrationInterface {
    name = 'PlaceImages1727986226681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "place" ADD "images" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "place" ADD "images" character varying NOT NULL`);
    }

}
