import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class ServiceUnavailableException extends AppException {
  constructor(message: string, code: string) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE, code);
  }
}
