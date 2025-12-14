import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

interface RequestWithUser {
  headers: Record<string, string | string[] | undefined>;
  user?: { id: bigint };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // For demo purposes, we'll get userId from header
    // In production, use JWT or session-based auth
    const userId = request.headers['x-user-id'];

    if (!userId || typeof userId !== 'string') {
      throw new UnauthorizedException('User ID is required');
    }

    // Attach user info to request
    request.user = { id: BigInt(userId) };
    return true;
  }
}
