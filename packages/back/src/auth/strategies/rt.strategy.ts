import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      // 🍪 핵심: 헤더가 아니라 "쿠키"에서 토큰을 꺼냅니다.
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      // 리프레시 토큰용 비밀키 사용
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') || '',
      // 만료된 토큰은 거부
      ignoreExpiration: false,
      // validate 함수에 req 객체를 넘겨줌 (필요시 토큰 문자열 자체를 쓰기 위함)
      passReqToCallback: true,
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.refreshToken;
    return {
      id: payload.sub,
      refreshToken,
    };
  }
}
