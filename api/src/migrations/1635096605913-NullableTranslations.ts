import {MigrationInterface, QueryRunner} from "typeorm";

export class NullableTranslations1635096605913 implements MigrationInterface {
    name = 'NullableTranslations1635096605913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_translation" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "faq_translation" ALTER COLUMN "question" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "faq_translation" ALTER COLUMN "answer" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "constituent_translation" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "constituent_translation" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ALTER COLUMN "review" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ALTER COLUMN "review" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "constituent_translation" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "constituent_translation" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "faq_translation" ALTER COLUMN "answer" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "faq_translation" ALTER COLUMN "question" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_translation" ALTER COLUMN "description" SET NOT NULL`);
    }

}
