import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class ForbiddenException extends AppException {
  constructor(message: string, code: string) {
    super(message, HttpStatus.FORBIDDEN, code);
  }
}
