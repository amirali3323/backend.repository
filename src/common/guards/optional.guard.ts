import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { CustomJwtService } from '../services/jwt.service';
import { AuthService } from 'src/module/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class OptionalGuard implements CanActivate {
  constructor(
    private readonly jwtService: CustomJwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token =  request.headers['authorization']?.split(' ')[1];

    if (!token) {
      request['user'] = null;
      return true;
    }

    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.authService.getUser(payload.userId);
      request['user'] = user || null;
    } catch {
      request['user'] = null;
    }

    return true;
  }
}
