import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class UnprocessableEntityException extends AppException {
  constructor(message: string, code: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, code);
  }
}
