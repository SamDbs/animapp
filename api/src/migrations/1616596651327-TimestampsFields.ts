import {MigrationInterface, QueryRunner} from "typeorm";

export class TimestampsFields1616596651327 implements MigrationInterface {
    name = 'TimestampsFields1616596651327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_translation" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_translation" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_translation" ADD "deteded_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "faq" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "faq" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "faq" ADD "deteded_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "faq_translation" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "faq_translation" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "faq_translation" ADD "deteded_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "language" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "language" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "language" ADD "deteded_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ADD "deteded_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "deteded_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "product" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" ADD "deteded_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "brand" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "brand" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "brand" ADD "deteded_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "deteded_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "deteded_at"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN "deteded_at"`);
        await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "deteded_at"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "deteded_at"`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" DROP COLUMN "deteded_at"`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "deteded_at"`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "faq_translation" DROP COLUMN "deteded_at"`);
        await queryRunner.query(`ALTER TABLE "faq_translation" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "faq_translation" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "faq" DROP COLUMN "deteded_at"`);
        await queryRunner.query(`ALTER TABLE "faq" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "faq" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product_translation" DROP COLUMN "deteded_at"`);
        await queryRunner.query(`ALTER TABLE "product_translation" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_translation" DROP COLUMN "created_at"`);
    }

}
