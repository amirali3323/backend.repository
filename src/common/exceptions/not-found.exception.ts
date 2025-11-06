import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class NotFoundException extends AppException {
  constructor(message: string, code: string) {
    super(message, HttpStatus.NOT_FOUND, code);
  }
}
