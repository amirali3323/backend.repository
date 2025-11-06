import { HttpStatus } from '@nestjs/common';
import { AppException } from '../app.exception';

export class BadRequestException extends AppException {
  constructor(message: string, code: string) {
    super(message, HttpStatus.BAD_REQUEST, code);
  }
}
