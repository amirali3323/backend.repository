import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { InternalServerException } from '../exceptions';
import { ErrorCode } from '../enums';

@Injectable()
export class CustomJwtService {
  private readonly JWT_SECRET: string;

  constructor(private readonly configService: ConfigService) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET')!;

    if (!this.JWT_SECRET) {
      throw new InternalServerException('JWT_SECRET is not defined in environment variables!', ErrorCode.INTERNAL_ERROR);
    }
  }
  async sign(userId: number, options?: SignOptions): Promise<string> {
    return jwt.sign({ userId }, this.JWT_SECRET, options);
  }

  async verify(token: string): Promise<{ userId: number }> {
    return jwt.verify(token, this.JWT_SECRET) as { userId: number };
  }

  async decode(token: string): Promise<JwtPayload | null> {
    try {
      return jwt.decode(token) as JwtPayload | null;
    } catch {
      return null;
    }
  }
}
