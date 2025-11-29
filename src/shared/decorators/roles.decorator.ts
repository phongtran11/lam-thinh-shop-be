import { SetMetadata } from '@nestjs/common';
import { Roles, ROLES } from 'src/shared/constants';

export const ROLES_KEY = 'roles';
export const RequiredRoles = (...roles: Roles[]) =>
  SetMetadata(ROLES_KEY, roles);

export const RoleAdmin = RequiredRoles(ROLES.ADMIN);
export const RoleManager = RequiredRoles(ROLES.MANAGER);
export const RoleStaff = RequiredRoles(ROLES.STAFF);
export const RoleCustomer = RequiredRoles(ROLES.CUSTOMER);
