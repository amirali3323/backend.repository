import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T = any> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: any) => ({
        success: true,
        statusCode: data?.statusCode ?? 200,
        message: data?.message ?? 'Success',
        data: data?.data ?? data,
      })),
    );
  }
}
