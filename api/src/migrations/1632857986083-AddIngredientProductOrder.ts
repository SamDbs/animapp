import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIngredientProductOrder1632857986083 implements MigrationInterface {
    name = 'AddIngredientProductOrder1632857986083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."product_ingredient" ADD "order" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."product_ingredient" DROP COLUMN "order"`);
    }

}
