import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageMigration1620479091707 implements MigrationInterface {
    name = 'ImageMigration1620479091707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "productId" integer, "ingredientId" integer, "image" bytea NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "REL_c6eb61588205e25a848ba6105c" UNIQUE ("productId"), CONSTRAINT "REL_aa9ad811ce4fa8c7ccc8d39fd1" UNIQUE ("ingredientId"), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_c6eb61588205e25a848ba6105cd" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_aa9ad811ce4fa8c7ccc8d39fd1e" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_aa9ad811ce4fa8c7ccc8d39fd1e"`);
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_c6eb61588205e25a848ba6105cd"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "photo" character varying`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "photo" character varying`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
