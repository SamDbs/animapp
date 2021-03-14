import {MigrationInterface, QueryRunner} from "typeorm";

export class initDatabase1615746400532 implements MigrationInterface {
    name = 'initDatabase1615746400532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_translation" DROP CONSTRAINT "FK_77562fa6f960ba7268ff8e306f3"`);
        await queryRunner.query(`ALTER TABLE "product_translation" ADD CONSTRAINT "FK_77562fa6f960ba7268ff8e306f3" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_translation" DROP CONSTRAINT "FK_77562fa6f960ba7268ff8e306f3"`);
        await queryRunner.query(`ALTER TABLE "product_translation" ADD CONSTRAINT "FK_77562fa6f960ba7268ff8e306f3" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
