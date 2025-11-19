import { MigrationInterface, QueryRunner } from "typeorm";

export class Ispulic1763448526159 implements MigrationInterface {
    name = 'Ispulic1763448526159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_room" ADD "isPublic" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_room" DROP COLUMN "isPublic"`);
    }

}
