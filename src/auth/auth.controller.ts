import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegistrationDto } from './dto';
import { JwtGuard } from './guard/jwt.guard';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { LocalGuard } from './guard/local.guard';
import { RequestUser } from './interface/request-user.interface';
import { UsersService } from 'src/users/users.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(200)
  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Req() request: RequestUser) {
    return request.user;
  }

  @Post('register')
  async register(@Body() registrationData: RegistrationDto) {
    const user = await this.authService.register(registrationData);
    if (user) {
      // await this.emailConfirmationService.sendVerificationLink(user.email);
    }
    return user;
  }

  @HttpCode(200)
  @UseGuards(LocalGuard)
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Req() request: RequestUser, @Res() response: Response) {
    const user = request.user;
    delete user.password;
    const accessTokenCookie = this.authService.getCookieWithJwtToken(user.id);
    const { refreshTokenCookie, refreshToken } =
      await this.authService.getCookieWithJwtRefreshToken(user.id);
    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestUser, @Res() response: Response) {
    const user = request.user;
    delete user.password;
    const accessTokenCookie = this.authService.getCookieWithJwtToken(user.id);

    response.setHeader('Set-Cookie', accessTokenCookie);
    return user;
  }

  @HttpCode(204)
  @UseGuards(JwtGuard)
  @Get('logout')
  async logout(@Req() request: RequestUser, @Res() response: Response) {
    await this.usersService.removeRefreshToken(request.user.id);
    // await this.usersService.turnOffTwoFactorAuthentication(request.user.id);
    response.setHeader('Set-Cookie', this.authService.getCookiesForLogout());
  }
}
