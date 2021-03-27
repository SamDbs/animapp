import {MigrationInterface, QueryRunner} from "typeorm";

export class FaqContactEntities1616585709575 implements MigrationInterface {
    name = 'FaqContactEntities1616585709575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "faq" ("id" SERIAL NOT NULL, CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "faq_translation" ("faqId" integer NOT NULL, "languageId" character varying NOT NULL, "question" character varying NOT NULL, "answer" character varying NOT NULL, CONSTRAINT "PK_40b1e067e6044e46976ea00d80a" PRIMARY KEY ("faqId", "languageId"))`);
        await queryRunner.query(`CREATE TABLE "contact" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "message" character varying NOT NULL, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "faq_translation" ADD CONSTRAINT "FK_1f7299d94bf4f98d60bdf07f74d" FOREIGN KEY ("faqId") REFERENCES "faq"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "faq_translation" ADD CONSTRAINT "FK_4358ead6e392fbf1819f501be55" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "faq_translation" DROP CONSTRAINT "FK_4358ead6e392fbf1819f501be55"`);
        await queryRunner.query(`ALTER TABLE "faq_translation" DROP CONSTRAINT "FK_1f7299d94bf4f98d60bdf07f74d"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "faq_translation"`);
        await queryRunner.query(`DROP TABLE "faq"`);
    }

}
