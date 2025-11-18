import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomJwtService } from '../services/jwt.service';
import { Request } from 'express';
import { AuthService } from 'src/module/auth/auth.service';
import { ForbiddenException } from '../exceptions';
import { ErrorCode } from '../enums';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly jwtService: CustomJwtService,
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler()) || [];
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new ForbiddenException('No token provided', ErrorCode.RESET_TOKEN_MISSING);

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token)
      throw new ForbiddenException('Invalid token format', ErrorCode.INVALID_RESET_TOKEN);

    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.authService.getUser(payload.userId);

      if (!user) {
        throw new ForbiddenException('User not found', ErrorCode.USER_NOT_FOUND);
      }

      request['user'] = user;

      if (roles.length && !roles.includes(user.role)) {
        throw new ForbiddenException('Access denied', ErrorCode.FORBIDDEN);
      }
      return true;
    } catch (err) {
      throw new ForbiddenException('Invalid token or access denied', ErrorCode.INVALID_RESET_TOKEN);
    }
  }
}
