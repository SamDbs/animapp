import {MigrationInterface, QueryRunner} from "typeorm";

export class BrandEntity1616531604497 implements MigrationInterface {
    name = 'BrandEntity1616531604497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6"`);
        await queryRunner.query(`COMMENT ON COLUMN "brand"."id" IS NULL`);
        await queryRunner.query(`CREATE SEQUENCE "brand_id_seq" OWNED BY "brand"."id"`);
        await queryRunner.query(`ALTER TABLE "brand" ALTER COLUMN "id" SET DEFAULT nextval('brand_id_seq')`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6"`);
        await queryRunner.query(`ALTER TABLE "brand" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "brand_id_seq"`);
        await queryRunner.query(`COMMENT ON COLUMN "brand"."id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
