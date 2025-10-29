import { Injectable } from '@nestjs/common';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';

@Injectable()
export class CustomJwtService {
  async sign(userId: number, options?: SignOptions): Promise<string> {
    return jwt.sign({ userId }, JWT_SECRET, options);
  }

  async verify(token: string): Promise<{ userId: number }> {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  }

  async decode(token: string): Promise<JwtPayload | null> {
    try {
      return jwt.decode(token) as JwtPayload | null;
    } catch {
      return null;
    }
  }
}
