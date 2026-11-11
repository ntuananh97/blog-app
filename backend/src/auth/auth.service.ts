import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginAttempService } from './rate-limit-login/login-attemp.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly loginAttempt: LoginAttempService,
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    // body: email, password
    const { email, password } = createAuthDto;
    // Check email exists in database
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      throw new BadRequestException('Email đã tồn tại');
    }
    // Create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return {
      message: 'Register successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    };
  }

  async login(createAuthDto: CreateAuthDto, ip: string) {
    const { email, password } = createAuthDto;
    // Create key in loginLimit store
    const key = this.loginAttempt.buildKey(email, ip);

    // Throw error if locking
    this.loginAttempt.assertNotLocked(key);

    // Check email exists in database
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      this.loginAttempt.registerFailure(key);
      throw new UnauthorizedException('Email or password is incorrect');
    }

    // Compare password
    const hashedPassword = user.password as string;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      this.loginAttempt.registerFailure(key);
      throw new UnauthorizedException('Email or password is incorrect');
    }

    // Login successfully, remove key
    this.loginAttempt.resetKey(key);

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });

    // Refresh token: secret riêng, thời hạn dài
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id },
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') ?? '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
