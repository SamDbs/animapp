import {MigrationInterface, QueryRunner} from "typeorm";

export class addPublishedInProduct1623785385577 implements MigrationInterface {
    name = 'addPublishedInProduct1623785385577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "published" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "published"`);
    }

}
