import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageType1620482090830 implements MigrationInterface {
    name = 'ImageType1620482090830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD "type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "type"`);
    }

}
