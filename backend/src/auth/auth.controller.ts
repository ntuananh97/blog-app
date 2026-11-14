import { Controller, Post, Body, Req, UseFilters } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { LoginLockedFilter } from './rate-limit-login/login-locked.filter';

@ApiTags('Auth')
@Controller('auth')
@UseFilters(LoginLockedFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @Throttle({
    default: {
      limit: 10,
      ttl: 60000,
    },
  })
  @ApiOperation({
    summary: 'Đăng nhập, trả về access token',
    description:
      'Sai mật khẩu 3 lần (theo email + IP) sẽ bị khóa đăng nhập 60 giây.',
  })
  @ApiResponse({ status: 201, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Sai email hoặc mật khẩu' })
  @ApiTooManyRequestsResponse({
    description: 'Bị khóa tạm thời hoặc vượt giới hạn request',
  })
  login(@Body() createAuthDto: CreateAuthDto, @Req() req: Request) {
    const ip = req.ip;
    return this.authService.login(createAuthDto, ip ?? 'unknown');
  }
}
