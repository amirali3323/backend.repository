import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { frontOrigin } from 'src/main';

export const corsConfig: CorsOptions = {
  origin: frontOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
