import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTAuthGuard } from './guard/auth.guard';
import { LoginAttempService } from './rate-limit-login/login-attemp.service';

@Global()
@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') ?? '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTAuthGuard, LoginAttempService],
  exports: [JWTAuthGuard, JwtModule],
})
export class AuthModule {}
