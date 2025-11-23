import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserIdentityDto } from '@/auth/dto/user-identity.dto';
import { UserService } from '@/user/user.service';
import { SocialLoginDto } from '@/auth/dto/social-login.dto';
import { ConfigService } from '@nestjs/config';
import { ref } from 'process';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateSocialUser(dto: SocialLoginDto): Promise<UserIdentityDto> {
    const user = await this.userService.findOrCreateSocialUser(dto);

    return {
      id: user.id,
      isAuthenticated: true,
    };
  }
  async refresh(oldRefreshToken: string) {
    // 1. 토큰 해독 (Strategy에서 이미 했지만, payload 정보 추출용으로 verifyAsync 한 번 더 해도 됨)
    // 혹은, Controller에서 넘겨준 userId를 바로 써도 됨.
    // 여기서는 안전하게 검증 한 번 더 하는 로직 예시:

    try {
      const payload = await this.jwtService.verifyAsync(oldRefreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.login({ id: payload.sub, isAuthenticated: true });
    } catch (e) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }
  }

  async getUserIdentityFromHeader(
    cookieHeader: string | undefined,
  ): Promise<UserIdentityDto> {
    // 1순위: JWT 토큰 (authToken)
    const token = this.extractCookie(cookieHeader, 'authToken');
    if (token) {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return {
        id: payload.sub,
        isAuthenticated: true,
      };
    }

    // 2순위: 익명 세션 (chat_session_id)
    const sessionId = this.extractCookie(cookieHeader, 'chat_session_id');
    if (sessionId) {
      return {
        id: sessionId,
        isAuthenticated: false,
      };
    }

    // 3순위: 둘 다 없으면 에러
    throw new UnauthorizedException('Missing credentials.');
  }

  async login(user: UserIdentityDto) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };
  }

  private extractCookie(
    cookieHeader: string | undefined,
    cookieName: string,
  ): string | null {
    if (!cookieHeader) return null;
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    const tokenCookie = cookies.find((c) => c.startsWith(`${cookieName}=`));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }
}
