import { MigrationInterface, QueryRunner } from "typeorm";

export class Deletegithub1763899331649 implements MigrationInterface {
    name = 'Deletegithub1763899331649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "githubAccessToken"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "githubAccessToken" character varying`);
    }

}
