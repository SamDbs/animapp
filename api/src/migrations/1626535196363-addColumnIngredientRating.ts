import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnIngredientRating1626535196363 implements MigrationInterface {
    name = 'addColumnIngredientRating1626535196363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "rating" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "rating"`);
    }

}
