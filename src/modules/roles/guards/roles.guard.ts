import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleRepository } from 'src/modules/roles/repositories/role.repository';
import { Roles } from 'src/modules/roles/types/role.type';
import { HTTPForbiddenException } from 'src/shared/exceptions/http-exceptions';
import { JwtPayload } from 'src/shared/modules/jwt-tokens/jwt-tokens.dto';

export const ROLES_KEY = 'rolesKey';

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

    const { user }: { user: JwtPayload } = context.switchToHttp().getRequest();

    if (!user) {
      throw new HTTPForbiddenException('User not authenticated');
    }

    // TODO: [ROLE] cache role by user id
    const role = await this.roleRepository.findRoleByUserId(user.sub);

    if (!role) {
      throw new HTTPForbiddenException(`Role not found for user ${user.email}`);
    }

    const roleName = role.name;

    const hasRequiredRole = requiredRoles.includes(roleName);

    if (!hasRequiredRole) {
      this.logger.warn(
        `User ${user.email} with role ${roleName} attempted to access resource requiring roles: ${requiredRoles.join(
          ', ',
        )}`,
      );
      throw new HTTPForbiddenException();
    }

    this.logger.debug(
      `User ${user.email} with role ${roleName} granted access`,
    );
    return true;
  }
}
