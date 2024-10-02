import { MigrationInterface, QueryRunner } from "typeorm";

export class PlaceAndUser1727881303555 implements MigrationInterface {
    name = 'PlaceAndUser1727881303555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "place" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying, "state" character varying, "country" character varying NOT NULL, "website" character varying, "categories" character varying NOT NULL, "short_description" character varying NOT NULL, "long_description" character varying NOT NULL, "images" character varying NOT NULL, "rating" double precision, "reviews" integer, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "location" geography(Point,4326) NOT NULL, CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "place"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
