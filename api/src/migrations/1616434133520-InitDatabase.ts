import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDatabase1616434133520 implements MigrationInterface {
    name = 'InitDatabase1616434133520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient_translation" DROP CONSTRAINT "FK_db56517b8fabe7a230df77fbc36"`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ADD CONSTRAINT "FK_db56517b8fabe7a230df77fbc36" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient_translation" DROP CONSTRAINT "FK_db56517b8fabe7a230df77fbc36"`);
        await queryRunner.query(`ALTER TABLE "ingredient_translation" ADD CONSTRAINT "FK_db56517b8fabe7a230df77fbc36" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
