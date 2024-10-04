import { MigrationInterface, QueryRunner } from "typeorm";

export class Categories1728055553743 implements MigrationInterface {
  name = "Categories1728055553743";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "place_categories_category" ("placeId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_6bf3c672f618396fe0e71db23f9" PRIMARY KEY ("placeId", "categoryId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8f097d3da1eb33c22aa6660ca8" ON "place_categories_category" ("placeId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f4c11aa3aeb31351b6fb5a237" ON "place_categories_category" ("categoryId") `
    );
    await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "categories"`);
    await queryRunner.query(
      `ALTER TABLE "place_categories_category" ADD CONSTRAINT "FK_8f097d3da1eb33c22aa6660ca86" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "place_categories_category" ADD CONSTRAINT "FK_4f4c11aa3aeb31351b6fb5a2371" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );

    await queryRunner.query(
      `INSERT INTO "category" (name) VALUES ('Attraction'), ('Food'), ('Nature'), ('Bar'), ('Shop')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "place_categories_category" DROP CONSTRAINT "FK_4f4c11aa3aeb31351b6fb5a2371"`
    );
    await queryRunner.query(
      `ALTER TABLE "place_categories_category" DROP CONSTRAINT "FK_8f097d3da1eb33c22aa6660ca86"`
    );
    await queryRunner.query(
      `ALTER TABLE "place" ADD "categories" character varying NOT NULL`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4f4c11aa3aeb31351b6fb5a237"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8f097d3da1eb33c22aa6660ca8"`
    );
    await queryRunner.query(`DROP TABLE "place_categories_category"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
