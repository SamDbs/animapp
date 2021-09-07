import {MigrationInterface, QueryRunner} from "typeorm";

export class addProductType1631037028335 implements MigrationInterface {
    name = 'addProductType1631037028335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."product" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."product_type_enum" AS ENUM('DRY_FOOD', 'TREATS', 'WET_FOOD')`);
        await queryRunner.query(`ALTER TABLE "public"."product" ADD "type" "public"."product_type_enum" NOT NULL DEFAULT 'DRY_FOOD'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."product" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."product_type_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."product" ADD "type" character varying`);
    }

}
