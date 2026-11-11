// src/auth/guards/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/common/decorator/current-user.decorator';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      // Verify token và gán payload trực tiếp vào object request
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);

      request['user'] = payload;
      return true;
    } catch (err) {
      Logger.error('Token is invalid or expired', err);
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }

  // Get token from header using Bearer scheme
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
