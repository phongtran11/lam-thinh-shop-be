import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum, RoleHierarchy } from 'src/shared/enums/roles.enum';
import { ROLES_KEY } from 'src/shared/decorators/roles.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { RoleRepository } from 'src/modules/roles/repositories/role.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private roleRepository: RoleRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user }: { user: User } = context.switchToHttp().getRequest();

    if (!user) {
      this.logger.warn('User not found in request');
      throw new ForbiddenException('User not authenticated');
    }

    const role = await this.roleRepository.findRoleByUserId(user.id);

    if (!role) {
      this.logger.warn(`Role not found for user ${user.email}`);
      throw new ForbiddenException('User role not found');
    }

    const roleName = role.name;
    const userRoleLevel = RoleHierarchy[roleName] || 0;

    // Check if user has any of the required roles or higher
    const hasRequiredRole = requiredRoles.some((role) => {
      const requiredRoleLevel = RoleHierarchy[role] || 0;
      return userRoleLevel >= requiredRoleLevel;
    });

    if (!hasRequiredRole) {
      this.logger.warn(
        `User ${user.email} with role ${roleName} attempted to access resource requiring roles: ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException('Insufficient role privileges');
    }

    this.logger.debug(
      `User ${user.email} with role ${roleName} granted access`,
    );
    return true;
  }
}
