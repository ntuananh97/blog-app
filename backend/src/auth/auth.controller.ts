import { Controller, Post, Body, Req, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { LoginLockedFilter } from './rate-limit-login/login-locked.filter';

@Controller('auth')
@UseFilters(LoginLockedFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
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
  login(@Body() createAuthDto: CreateAuthDto, @Req() req: Request) {
    const ip = req.ip;
    return this.authService.login(createAuthDto, ip ?? 'unknown');
  }
}
