import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatName1764843249402 implements MigrationInterface {
  name = 'ChatName1764843249402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chats" ADD "senderName" character varying(50) NOT NULL DEFAULT '알 수 없음'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chats" DROP COLUMN "senderName"`);
  }
}
