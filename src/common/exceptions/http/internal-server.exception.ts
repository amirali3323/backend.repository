import { HttpStatus } from '@nestjs/common';
import { AppException } from '../app.exception';

export class InternalServerException extends AppException {
  constructor(message: string, code: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, code);
  }
}
