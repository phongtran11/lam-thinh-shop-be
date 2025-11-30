import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from 'src/modules/auth';
import { UsersRepository } from 'src/modules/users/repositories';
import { Permissions } from 'src/shared/constants';
import { PERMISSIONS_KEY } from 'src/shared/decorators';
import { HTTPForbiddenException } from 'src/shared/exceptions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly usersRepository: UsersRepository,
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

    const userPermissionNames =
      await this.usersRepository.findPermissionNamesByUserId(user.sub);

    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissionNames.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new HTTPForbiddenException(
        `User ${user.email} attempted to access resource requiring permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    this.logger.debug(
      `User ${user.email} granted access with permissions: ${requiredPermissions.join(
        ', ',
      )}`,
    );

    return true;
  }
}
