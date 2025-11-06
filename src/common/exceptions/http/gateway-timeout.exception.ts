import { HttpStatus } from '@nestjs/common';
import { AppException } from '../app.exception';

export class GatewayTimeoutException extends AppException {
  constructor(message: string, code: string) {
    super(message, HttpStatus.GATEWAY_TIMEOUT, code);
  }
}
