import { MigrationInterface, QueryRunner } from "typeorm";

export class EditRequest1727979594233 implements MigrationInterface {
    name = 'EditRequest1727979594233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profilePicture" character varying`);
        await queryRunner.query(`ALTER TABLE "place" ADD "addedByUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "place" ADD CONSTRAINT "FK_727a16cfba9623f4fcb5fdfa78f" FOREIGN KEY ("addedByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" DROP CONSTRAINT "FK_727a16cfba9623f4fcb5fdfa78f"`);
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "addedByUserId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profilePicture"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
