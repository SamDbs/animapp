import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUniqueNameOnProducts1625404206659 implements MigrationInterface {
    name = 'AddUniqueNameOnProducts1625404206659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "product"."name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77"`);
        await queryRunner.query(`COMMENT ON COLUMN "product"."name" IS NULL`);
    }

}
