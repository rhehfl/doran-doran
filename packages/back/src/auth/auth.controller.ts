import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CookieService } from '@/common/cookie/cookie.service';
import { UserIdentityDto } from '@/auth/dto/user-identity.dto';
import { AuthGuard as JWTAuthGuard } from '@/auth/auth.guard';
import { User } from 'common';
import { User as UserDecorator } from '@/auth/user.decorator';
import { UserService } from '@/user/user.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService,
    private readonly userService: UserService,
  ) {}

  @Get('me')
  @UseGuards(JWTAuthGuard)
  async getMe(@UserDecorator() user: UserIdentityDto): Promise<User | null> {
    if (user.isAuthenticated) {
      const findUser = await this.userService.findOne(user.id);

      if (findUser) {
        return {
          userId: findUser.id,
          nickname: findUser.nickname,
          profileUrl: findUser.profileUrl,
          isAuthenticated: true,
        };
      }
    }

    return null;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLoginStart() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res: Response) {
    const user = req.user as UserIdentityDto;

    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const jwtToken = await this.authService.login(user);
    const accessToken = jwtToken.access_token;
    const refreshToken = jwtToken.refresh_token;

    const isDevelopment = nodeEnv === 'dev';

    let redirectUrl = '';
    if (isDevelopment) {
      redirectUrl = `https://localhost:3000/auth/callback`;
    } else {
      redirectUrl = `https://www.doran-doran.cloud/auth/callback`;
    }

    this.cookieService.set(res, 'authToken', accessToken);
    this.cookieService.set(res, 'refreshToken', refreshToken);
    res.redirect(redirectUrl);
  }
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh')) // 👈 방금 만든 RT 전략 사용
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    // Guard를 통과했다는 건 RT가 유효하다는 뜻!
    // req.user에는 Strategy의 validate 리턴값이 들어있습니다.
    const oldRefreshToken = req.user.refreshToken;
    // 서비스에 요청 (새 토큰 발급)
    // (Stateless라 oldRefreshToken은 사실 안 써도 되지만,
    // 나중에 블랙리스트 기능을 넣을 수도 있으니 넘겨는 둡니다)
    const tokens = await this.authService.refresh(oldRefreshToken);

    // 🍪 쿠키 굽기 (Login 때와 동일한 옵션)
    // 1. Access Token
    this.cookieService.set(res, 'authToken', tokens.access_token);
    this.cookieService.set(res, 'refreshToken', tokens.refresh_token);
    return { message: 'Refreshed successfully' };
  }

  @Post('logout')
  @UseGuards(JWTAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    this.cookieService.clear(res, 'authToken');
    this.cookieService.clear(res, 'refreshToken');

    return { message: 'Logged out successfully' };
  }
}
