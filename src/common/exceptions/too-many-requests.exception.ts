import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class TooManyRequestsException extends AppException {
  constructor(message: string, code: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS, code);
  }
}
