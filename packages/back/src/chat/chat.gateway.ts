import { AuthService } from '@/auth/auth.service';
import { ChatService } from '@/chat/chat.service';
import { ChatRoomsService } from '@/chat_rooms/chat_rooms.service';
import { GeminiService } from '@/gemini/gemini.service';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '@/user/user.service';
import { ERROR_CODE, Message, User } from 'common';
import { createAnonymous } from '@/utils/createAnonymous';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: [
      'https://localhost:3000',
      'https://doran-doran.cloud',
      'https://www.doran-doran.cloud',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly geminiService: GeminiService,
    private readonly chatRoomsService: ChatRoomsService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async getCurrentUser(cookieHeader: string | undefined): Promise<User> {
    const userDto =
      await this.authService.getUserIdentityFromHeader(cookieHeader);
    const findUser = await this.userService.findOne(userDto.id);

    if (findUser) {
      return {
        userId: findUser.id,
        nickname: findUser.nickname,
        profileUrl: findUser.profileUrl,
        isAuthenticated: true,
      };
    }

    return createAnonymous(userDto.id);
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const cookieHeader = socket.handshake.headers.cookie;
    const roomId = socket.handshake.query.roomId;
    let user: User;

    if (!roomId) {
      socket.emit('error', { message: '방 ID가 없습니다.' });
      socket.disconnect();
      return;
    }

    try {
      user = await this.getCurrentUser(cookieHeader);
    } catch (error) {
      console.error('[WS Connection Error] Auth failed:', error.message);
      socket.emit('error', { message: ERROR_CODE.UNAUTHORIZED });
      socket.disconnect();
      return;
    }

    try {
      const data = await this.chatRoomsService.getChatRoomById(
        Number(roomId),
        user.userId,
      );
      socket.data.roomId = roomId;
      socket.data.personaId = data.persona.id;

      await this.chatService.setSystemInstruction(
        Number(roomId),
        data.persona.prompt,
      );
    } catch (error) {
      socket.emit('error', {
        message: '채팅방을 찾을 수 없거나 접근 권한이 없습니다.',
        code: error.status || 500,
      });
      socket.disconnect();
      return;
    }

    socket.data.user = user;
    await this.chatService.addActiveUser(Number(roomId), socket.id, user);
    this.server.to(`room_${roomId}`).emit('join-user', user);

    socket.join(`room_${roomId}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: Message,
  ) {
    const roomId = socket.data.roomId as string;
    const user = socket.data.user as User;
    const personaId = socket.data.personaId as number;
    const roomName = `room_${roomId}`;

    if (!roomId || !user || !personaId) {
      socket.emit('error', {
        message: '비정상적인 연결입니다. 재접속해 주세요.',
      });
      return;
    }
    this.server.to(roomName).emit('message', payload);
    try {
      await this.chatService.saveChatMessage(
        Number(roomId),
        payload,
        user.userId,
        personaId,
        user.isAuthenticated,
      );
    } catch (error) {
      this.server.to(roomName).emit('save-error', {
        message: '메시지 처리 중 오류가 발생했습니다.',
        reason: error.message,
      });
      console.error('[WS Message Error]:', error);
    }
    const recentHistory = await this.chatService.getChatHistory(Number(roomId));
    const systemInstruction = await this.chatService.getSystemInstruction(
      Number(roomId),
    );
    if (!systemInstruction) return '';

    const aiResponseText = await this.geminiService.generateStreamContent(
      recentHistory,
      systemInstruction,
      this.server.to(roomName),
      payload.content,
    );

    const aiMessage: Message = {
      userId: user.userId,
      author: 'Gemini',
      content: aiResponseText,
    };

    await this.chatService.saveChatMessage(
      Number(roomId),
      aiMessage,
      user.userId,
      personaId,
      user.isAuthenticated,
    );
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const roomId = socket.data.roomId;
    console.log(socket.data.user);
    if (roomId) {
      await this.chatService.removeActiveUser(Number(roomId), socket.id);

      this.server.to(`room_${roomId}`).emit('leave-user', socket.data.user);
    }
  }

  private async broadcastActiveUsers(roomId: number) {
    const activeUsers = await this.chatService.getActiveUsers(roomId);
    this.server.to(`room_${roomId}`).emit('active-users', activeUsers);
  }
}
