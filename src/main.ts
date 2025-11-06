import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { validationConfig } from './common/config/validation.config';
import { appConfig } from './common/config/app.config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptors';

export const frontOrigin = 'http://172.16.112.62:3000';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(new ValidationPipe(validationConfig));
  app.enableCors({
    origin: frontOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.use(cookieParser());

  app.listen(appConfig.port, appConfig.host, () => {
    console.log(`🚀 Server running on http://${appConfig.host}:${appConfig.port}`);
  });
}
bootstrap();
