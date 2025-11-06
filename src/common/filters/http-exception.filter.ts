import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

/**
 * Global exception filter for unified error handling
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode: string | undefined;

    // Handle known HTTP exceptions
    if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      status = exception.getStatus();
      message = res?.message || exception.message;
      errorCode = res?.errorCode || res?.code;
    }
    // Handle unexpected errors
    else if (exception instanceof Error) {
      message = exception.message;
    }

    // Send unified error response
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errorCode,
      data: null,
    });
  }
}
