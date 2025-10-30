import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const method = req.method;
    const url = req.originalUrl;
    const time = new Date().toISOString();

    console.log(`[${time}] ${ip} → ${method} ${url}`);

    next();
  }
}
