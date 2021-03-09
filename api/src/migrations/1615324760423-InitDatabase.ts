import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDatabase1615324760423 implements MigrationInterface {
    name = 'InitDatabase1615324760423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ingredient_translation" ("ingredientId" integer NOT NULL, "languageId" character varying NOT NULL, "name" character varying NOT NULL, "review" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_f553725e5b1ccd08da3dbd0a7ea" PRIMARY KEY ("ingredientId", "languageId"))`);
        await queryRunner.query(`CREATE TABLE "language" ("id" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_translation" ("productId" integer NOT NULL, "languageId" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_393ea5a38a9bc79815ba34e085b" PRIMARY KEY ("productId", "languageId"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingredient" ("id" SERIAL NOT NULL, CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_ingredients_ingredient" ("productId" integer NOT NULL, "ingredientId" integer NOT NULL, CONSTRAINT "PK_5ef80d7e1f18da1a12043082894" PRIMARY KEY ("productId", "ingredientId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d12a293c29f0482f00f1f2f538" ON "product_ingredients_ingredient" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9c2894b25a66c9533f22de9a06" ON "product_ingredients_ingredient" ("ingredientId") `);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ADD CONSTRAINT "FK_db56517b8fabe7a230df77fbc36" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ADD CONSTRAINT "FK_f37c44c99fe8d67181db9138736" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_translation" ADD CONSTRAINT "FK_77562fa6f960ba7268ff8e306f3" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_translation" ADD CONSTRAINT "FK_ed033fde4612a6a13aedd889ba9" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_ingredients_ingredient" ADD CONSTRAINT "FK_d12a293c29f0482f00f1f2f538b" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_ingredients_ingredient" ADD CONSTRAINT "FK_9c2894b25a66c9533f22de9a06e" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_ingredients_ingredient" DROP CONSTRAINT "FK_9c2894b25a66c9533f22de9a06e"`);
        await queryRunner.query(`ALTER TABLE "product_ingredients_ingredient" DROP CONSTRAINT "FK_d12a293c29f0482f00f1f2f538b"`);
        await queryRunner.query(`ALTER TABLE "product_translation" DROP CONSTRAINT "FK_ed033fde4612a6a13aedd889ba9"`);
        await queryRunner.query(`ALTER TABLE "product_translation" DROP CONSTRAINT "FK_77562fa6f960ba7268ff8e306f3"`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" DROP CONSTRAINT "FK_f37c44c99fe8d67181db9138736"`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" DROP CONSTRAINT "FK_db56517b8fabe7a230df77fbc36"`);
        await queryRunner.query(`DROP INDEX "IDX_9c2894b25a66c9533f22de9a06"`);
        await queryRunner.query(`DROP INDEX "IDX_d12a293c29f0482f00f1f2f538"`);
        await queryRunner.query(`DROP TABLE "product_ingredients_ingredient"`);
        await queryRunner.query(`DROP TABLE "ingredient"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "product_translation"`);
        await queryRunner.query(`DROP TABLE "language"`);
        await queryRunner.query(`DROP TABLE "ingredient_translation"`);
    }

}
