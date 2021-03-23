import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDatabase1616345123859 implements MigrationInterface {
    name = 'InitDatabase1616345123859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "photo" character varying`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "photo" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "photo"`);
    }

}
