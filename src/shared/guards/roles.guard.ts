import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleRepository } from 'src/modules/roles-permissions/repositories/role.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { Roles } from 'src/shared/constants/role.constant';
import { ROLES_KEY } from 'src/shared/decorators/roles.decorator';
import { HTTPForbiddenException } from 'src/shared/exceptions';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private roleRepository: RoleRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user }: { user: User } = context.switchToHttp().getRequest();

    if (!user) {
      throw new HTTPForbiddenException('User not authenticated');
    }

    const role = await this.roleRepository.findRoleByUserId(user.id);

    if (!role) {
      throw new HTTPForbiddenException(`Role not found for user ${user.email}`);
    }

    const roleName = role.name;

    const hasRequiredRole = requiredRoles.includes(roleName);

    if (!hasRequiredRole) {
      throw new HTTPForbiddenException(
        `User ${user.email} with role ${roleName} attempted to access resource requiring roles: ${requiredRoles.join(', ')}`,
      );
    }

    this.logger.debug(
      `User ${user.email} with role ${roleName} granted access`,
    );
    return true;
  }
}
