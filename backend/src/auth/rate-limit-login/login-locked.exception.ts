import { HttpException, HttpStatus } from '@nestjs/common';

export class LoginLockedException extends HttpException {
  constructor(public readonly retryAfter: number) {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: `Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau ${retryAfter} giây.`,
        retryAfter,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
