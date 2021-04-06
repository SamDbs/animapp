import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDatabase1617725509617 implements MigrationInterface {
    name = 'InitDatabase1617725509617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_translation" ("productId" integer NOT NULL, "languageId" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_393ea5a38a9bc79815ba34e085b" PRIMARY KEY ("productId", "languageId"))`);
        await queryRunner.query(`CREATE TABLE "faq" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "faq_translation" ("faqId" integer NOT NULL, "languageId" character varying NOT NULL, "question" character varying NOT NULL, "answer" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_40b1e067e6044e46976ea00d80a" PRIMARY KEY ("faqId", "languageId"))`);
        await queryRunner.query(`CREATE TABLE "constituent_translation" ("analyticalConstituentId" integer NOT NULL, "languageId" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2aab032da8466f4780a00090684" PRIMARY KEY ("analyticalConstituentId", "languageId"))`);
        await queryRunner.query(`CREATE TABLE "language" ("id" character varying NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingredient_translation" ("ingredientId" integer NOT NULL, "languageId" character varying NOT NULL, "name" character varying NOT NULL, "review" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_f553725e5b1ccd08da3dbd0a7ea" PRIMARY KEY ("ingredientId", "languageId"))`);
        await queryRunner.query(`CREATE TABLE "ingredient" ("id" SERIAL NOT NULL, "photo" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brand" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "photo" character varying, "barCode" character varying NOT NULL, "brandId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_analytical_constituent" ("productId" integer NOT NULL, "analyticalConstituentId" integer NOT NULL, "quantity" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_33fb4becffaa3f2c6d06099b8df" PRIMARY KEY ("productId", "analyticalConstituentId"))`);
        await queryRunner.query(`CREATE TABLE "analytical_constituent" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_90e97f570c2fc0e024675dc4582" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_ingredients_ingredient" ("productId" integer NOT NULL, "ingredientId" integer NOT NULL, CONSTRAINT "PK_5ef80d7e1f18da1a12043082894" PRIMARY KEY ("productId", "ingredientId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d12a293c29f0482f00f1f2f538" ON "product_ingredients_ingredient" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9c2894b25a66c9533f22de9a06" ON "product_ingredients_ingredient" ("ingredientId") `);
        await queryRunner.query(`ALTER TABLE "product_translation" ADD CONSTRAINT "FK_77562fa6f960ba7268ff8e306f3" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_translation" ADD CONSTRAINT "FK_ed033fde4612a6a13aedd889ba9" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "faq_translation" ADD CONSTRAINT "FK_1f7299d94bf4f98d60bdf07f74d" FOREIGN KEY ("faqId") REFERENCES "faq"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "faq_translation" ADD CONSTRAINT "FK_4358ead6e392fbf1819f501be55" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "constituent_translation" ADD CONSTRAINT "FK_e30da97706dbe5bfa1ed632a37e" FOREIGN KEY ("analyticalConstituentId") REFERENCES "analytical_constituent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "constituent_translation" ADD CONSTRAINT "FK_c8955a3bdb680e52a293e7d099a" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ADD CONSTRAINT "FK_db56517b8fabe7a230df77fbc36" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ADD CONSTRAINT "FK_f37c44c99fe8d67181db9138736" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_analytical_constituent" ADD CONSTRAINT "FK_5d526bc710e9e869022468bc65a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_analytical_constituent" ADD CONSTRAINT "FK_c6f9d5b95053f32212710a7892f" FOREIGN KEY ("analyticalConstituentId") REFERENCES "analytical_constituent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_ingredients_ingredient" ADD CONSTRAINT "FK_d12a293c29f0482f00f1f2f538b" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_ingredients_ingredient" ADD CONSTRAINT "FK_9c2894b25a66c9533f22de9a06e" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_ingredients_ingredient" DROP CONSTRAINT "FK_9c2894b25a66c9533f22de9a06e"`);
        await queryRunner.query(`ALTER TABLE "product_ingredients_ingredient" DROP CONSTRAINT "FK_d12a293c29f0482f00f1f2f538b"`);
        await queryRunner.query(`ALTER TABLE "product_analytical_constituent" DROP CONSTRAINT "FK_c6f9d5b95053f32212710a7892f"`);
        await queryRunner.query(`ALTER TABLE "product_analytical_constituent" DROP CONSTRAINT "FK_5d526bc710e9e869022468bc65a"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6"`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" DROP CONSTRAINT "FK_f37c44c99fe8d67181db9138736"`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" DROP CONSTRAINT "FK_db56517b8fabe7a230df77fbc36"`);
        await queryRunner.query(`ALTER TABLE "constituent_translation" DROP CONSTRAINT "FK_c8955a3bdb680e52a293e7d099a"`);
        await queryRunner.query(`ALTER TABLE "constituent_translation" DROP CONSTRAINT "FK_e30da97706dbe5bfa1ed632a37e"`);
        await queryRunner.query(`ALTER TABLE "faq_translation" DROP CONSTRAINT "FK_4358ead6e392fbf1819f501be55"`);
        await queryRunner.query(`ALTER TABLE "faq_translation" DROP CONSTRAINT "FK_1f7299d94bf4f98d60bdf07f74d"`);
        await queryRunner.query(`ALTER TABLE "product_translation" DROP CONSTRAINT "FK_ed033fde4612a6a13aedd889ba9"`);
        await queryRunner.query(`ALTER TABLE "product_translation" DROP CONSTRAINT "FK_77562fa6f960ba7268ff8e306f3"`);
        await queryRunner.query(`DROP INDEX "IDX_9c2894b25a66c9533f22de9a06"`);
        await queryRunner.query(`DROP INDEX "IDX_d12a293c29f0482f00f1f2f538"`);
        await queryRunner.query(`DROP TABLE "product_ingredients_ingredient"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "analytical_constituent"`);
        await queryRunner.query(`DROP TABLE "product_analytical_constituent"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "brand"`);
        await queryRunner.query(`DROP TABLE "ingredient"`);
        await queryRunner.query(`DROP TABLE "ingredient_translation"`);
        await queryRunner.query(`DROP TABLE "language"`);
        await queryRunner.query(`DROP TABLE "constituent_translation"`);
        await queryRunner.query(`DROP TABLE "faq_translation"`);
        await queryRunner.query(`DROP TABLE "faq"`);
        await queryRunner.query(`DROP TABLE "product_translation"`);
    }

}
