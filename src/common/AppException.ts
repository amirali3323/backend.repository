import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super({ message, statusCode }, statusCode);
  }
}