import {MigrationInterface, QueryRunner} from "typeorm";

export class createProductIngredientRelation1623359608184 implements MigrationInterface {
    name = 'createProductIngredientRelation1623359608184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_ingredient" ("productId" integer NOT NULL, "ingredientId" integer NOT NULL, "quantity" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_fe3d51f0d10790f677f410f827c" PRIMARY KEY ("productId", "ingredientId"))`);
        await queryRunner.query(`ALTER TABLE "product_ingredient" ADD CONSTRAINT "FK_d6fd52ba735eee4514d0a9a92cc" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_ingredient" ADD CONSTRAINT "FK_1525d4cd30cd2af9de7952a0fe2" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_ingredient" DROP CONSTRAINT "FK_1525d4cd30cd2af9de7952a0fe2"`);
        await queryRunner.query(`ALTER TABLE "product_ingredient" DROP CONSTRAINT "FK_d6fd52ba735eee4514d0a9a92cc"`);
        await queryRunner.query(`DROP TABLE "product_ingredient"`);
    }

}
