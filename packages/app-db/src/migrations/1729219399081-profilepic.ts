import { MigrationInterface, QueryRunner } from "typeorm";

export class Profilepic1729219399081 implements MigrationInterface {
    name = 'Profilepic1729219399081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "profilePicture" TO "profilePictureId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profilePictureId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profilePictureId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_f58f9c73bc58e409038e56a4055" UNIQUE ("profilePictureId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f58f9c73bc58e409038e56a4055" FOREIGN KEY ("profilePictureId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f58f9c73bc58e409038e56a4055"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_f58f9c73bc58e409038e56a4055"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profilePictureId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profilePictureId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "profilePictureId" TO "profilePicture"`);
    }

}
