import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEnum } from 'src/shared/enums/permissions.enum';
import { PERMISSIONS_KEY } from 'src/shared/decorators/permissions.decorator';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permission restriction
    }

    const { user }: { user: User } = context.switchToHttp().getRequest();

    if (!user) {
      this.logger.warn('User not found in request');
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.hasPermission(permission),
    );

    if (!hasAllPermissions) {
      this.logger.warn(
        `User ${user.email} attempted to access resource requiring permissions: ${requiredPermissions.join(
          ', ',
        )}`,
      );
      throw new ForbiddenException('Insufficient permissions');
    }

    this.logger.debug(
      `User ${user.email} granted access with permissions: ${requiredPermissions.join(
        ', ',
      )}`,
    );

    return true;
  }
}
