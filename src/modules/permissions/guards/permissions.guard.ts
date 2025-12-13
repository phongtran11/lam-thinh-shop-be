import {
  Injectable,
  CanActivate,
  Logger,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from 'src/modules/permissions/types/permission.type';
import { HTTPForbiddenException } from 'src/shared/exceptions/http-exceptions';
import { JwtPayload } from 'src/shared/modules/jwt-tokens/jwt-tokens.dto';
import { PermissionRepository } from '../repositories/permission.repository';

export const PERMISSIONS_KEY = 'permissionsKey';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly permissionsRepo: PermissionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permissions[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permission restriction
    }

    const { user }: { user: JwtPayload } = context.switchToHttp().getRequest();

    if (!user) {
      throw new HTTPForbiddenException('User not authenticated');
    }

    // TODO: [Permission] cache permission names by user id
    const permissionNames =
      await this.permissionsRepo.findPermissionNamesByUserId(user.sub);

    const userPermissions = new Set(permissionNames.map((p) => p.name));

    const hasAllPermissions = requiredPermissions.every((p) =>
      userPermissions.has(p),
    );

    if (!hasAllPermissions) {
      this.logger.warn(
        `User ${user.email} attempted to access resource requiring permissions: ${requiredPermissions.join(
          ', ',
        )}`,
      );
      throw new HTTPForbiddenException();
    }

    this.logger.debug(
      `User ${user.email} granted access with permissions: ${requiredPermissions.join(
        ', ',
      )}`,
    );

    return true;
  }
}
