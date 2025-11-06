import { HttpStatus } from '@nestjs/common';
import { AppException } from '../app.exception';

export class ConflictException extends AppException {
  constructor(message: string, code: string) {
    super(message, HttpStatus.CONFLICT, code);
  }
}
