import { MigrationInterface, QueryRunner } from "typeorm";

export class ChatProfileUrl1764845123411 implements MigrationInterface {
    name = 'ChatProfileUrl1764845123411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chats" ADD "senderProfileImage" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "chats" ALTER COLUMN "senderName" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chats" ALTER COLUMN "senderName" SET DEFAULT '알 수 없음'`);
        await queryRunner.query(`ALTER TABLE "chats" DROP COLUMN "senderProfileImage"`);
    }

}
