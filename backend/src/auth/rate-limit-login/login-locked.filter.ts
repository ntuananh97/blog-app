import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { LoginLockedException } from './login-locked.exception';

@Catch(LoginLockedException)
export class LoginLockedFilter implements ExceptionFilter {
  catch(exception: LoginLockedException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    res.setHeader('Retry-After', String(exception.retryAfter));
    res.status(exception.getStatus()).json(exception.getResponse());
  }
}
