import { MigrationInterface, QueryRunner } from "typeorm";

export class Profilepictable1729220303027 implements MigrationInterface {
    name = 'Profilepictable1729220303027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f58f9c73bc58e409038e56a4055"`);
        await queryRunner.query(`CREATE TABLE "profile_picture" ("id" SERIAL NOT NULL, "src" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_bff7cf5dab19806d713071f0f84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile_picture" ADD CONSTRAINT "FK_ab4229950292cb6e896d012dac8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f58f9c73bc58e409038e56a4055" FOREIGN KEY ("profilePictureId") REFERENCES "profile_picture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f58f9c73bc58e409038e56a4055"`);
        await queryRunner.query(`ALTER TABLE "profile_picture" DROP CONSTRAINT "FK_ab4229950292cb6e896d012dac8"`);
        await queryRunner.query(`DROP TABLE "profile_picture"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f58f9c73bc58e409038e56a4055" FOREIGN KEY ("profilePictureId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
