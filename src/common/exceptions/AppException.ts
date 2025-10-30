import { HttpException, HttpStatus } from '@nestjs/common';

enum ErrorCode {
  DISTRICT_NOT_FOUND = 'DISTRICT_NOT_FOUND',
  POST_NOT_FOUND = 'POST_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

export class AppException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, errorCode?: ErrorCode) {
    super({ message, statusCode, errorCode }, statusCode);
  }
}