import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageUrl1620483319034 implements MigrationInterface {
    name = 'ImageUrl1620483319034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD "url" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "url"`);
    }

}
