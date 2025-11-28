import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, Not, Repository } from 'typeorm';

import { CreateChatRoomDto } from '@/chat_rooms/dto/create-chat-room.dto';
import { ChatRoom } from '@/chat_rooms/chat-room.entity';
import { User } from '@/user/user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * 1. CREATE: 채팅방 생성 (이미 존재하는 경우, 기존 채팅방 반환)
   */
  async createChatRoom(createDto: CreateChatRoomDto): Promise<ChatRoom> {
    const { userId, personaId, isAuthenticated } = createDto;

    const existingRoom = await this.chatRoomRepository.findOne({
      where: { userId, persona: { id: personaId } },
    });

    if (existingRoom) {
      return existingRoom;
    }

    if (!isAuthenticated) {
      const ANONYMOUS_ROOM_LIMIT = 5;
      const roomCount = await this.chatRoomRepository.count({
        where: { userId },
      });

      if (roomCount >= ANONYMOUS_ROOM_LIMIT) {
        throw new ForbiddenException(
          `익명 사용자는 채팅방을 ${ANONYMOUS_ROOM_LIMIT}개까지만 생성할 수 있습니다. 로그인해 주세요.`,
        );
      }
    }

    const newRoom: Partial<ChatRoom> = this.chatRoomRepository.create({
      userId,
      persona: { id: personaId },
    });
    if (isAuthenticated) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (user) {
        newRoom.user = user;
      }
    }

    return this.chatRoomRepository.save(newRoom);
  }

  async getChatRoomById(roomId: number, userId: string): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      select: {
        id: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        isPublic: true,
        persona: { id: true, name: true, prompt: true, image: true },
      },
      relations: ['persona'],
    });

    if (!chatRoom) {
      throw new NotFoundException(`ChatRoom with ID ${roomId} not found.`);
    }

    if (chatRoom.userId !== userId && !chatRoom.isPublic) {
      throw new ForbiddenException(`이 채팅방에 접근할 권한이 없습니다.`);
    }

    return chatRoom;
  }
  async updateRoomPublicStatus(
    roomId: number,
    userId: string,
    isPublic: boolean,
  ): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
    });

    if (!chatRoom) {
      throw new NotFoundException(`ChatRoom not found.`);
    }

    if (chatRoom.userId !== userId) {
      throw new ForbiddenException('채팅방 설정을 변경할 권한이 없습니다.');
    }

    chatRoom.isPublic = isPublic;
    return this.chatRoomRepository.save(chatRoom);
  }
  async getAllChatRooms(userId: string): Promise<ChatRoom[]> {
    return this.chatRoomRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
      select: {
        id: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        persona: { id: true, name: true, image: true },
      },
      relations: ['persona'],
    });
  }

  async getAllPublicChatRooms(excludeUserId?: string): Promise<ChatRoom[]> {
    const whereCondition: { isPublic: boolean; userId?: FindOperator<string> } =
      { isPublic: true };

    if (excludeUserId) {
      whereCondition.userId = Not(excludeUserId);
    }

    return this.chatRoomRepository.find({
      where: whereCondition,
      order: { updatedAt: 'DESC' },
      select: {
        id: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        persona: { id: true, name: true, image: true },
      },
      relations: ['persona'],
    });
  }

  async deleteChatRoom(
    id: number,
    userId: string,
  ): Promise<{ deleted: boolean; message: string }> {
    const result = await this.chatRoomRepository.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException(
        `ChatRoom with ID ${id} not found or access denied.`,
      );
    }

    return {
      deleted: true,
      message: `ChatRoom with ID ${id} successfully deleted.`,
    };
  }
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async handleCronDeleteGuestRooms() {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    try {
      // 1. 삭제 대상 방의 ID들을 먼저 조회합니다. (바로 delete하지 않음)
      const targetRooms = await this.chatRoomRepository
        .createQueryBuilder('chatRoom')
        .select('chatRoom.id') // ID만 가져옴
        .where('chatRoom.createdAt <= :date', { date: twentyFourHoursAgo })
        .andWhere('chatRoom.user IS NULL') // 익명 방 조건
        .getMany();

      if (targetRooms.length === 0) return;

      const targetIds = targetRooms.map((room) => room.id);
      console.log(`🗑️ 삭제 대상 방 ID 목록: ${targetIds.join(', ')}`);

      if (targetIds.length > 0) {
        this.eventEmitter.emit('rooms.deleted', { roomIds: targetIds });
      }
      await this.chatRoomRepository
        .createQueryBuilder()
        .delete()
        .from(ChatRoom)
        .whereInIds(targetIds)
        .execute();

      console.log(
        `✅ 정리 완료: 총 ${targetIds.length}개의 방과 캐시를 삭제했습니다.`,
      );
    } catch (error) {
      console.error('❌ 채팅방 삭제 스케줄러 오류:', error);
    }
  }
}
