import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUniqueNameOnBrands1625404469120 implements MigrationInterface {
    name = 'AddUniqueNameOnBrands1625404469120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "brand"."name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "brand" ADD CONSTRAINT "UQ_5f468ae5696f07da025138e38f7" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brand" DROP CONSTRAINT "UQ_5f468ae5696f07da025138e38f7"`);
        await queryRunner.query(`COMMENT ON COLUMN "brand"."name" IS NULL`);
    }

}
