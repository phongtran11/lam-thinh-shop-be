import { SetMetadata } from '@nestjs/common';
import { ERoles, ROLES } from '../constants/role.constant';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ERoles[]) => SetMetadata(ROLES_KEY, roles);

export const RoleAdmin = Roles(ROLES.ADMIN);
export const RoleManager = Roles(ROLES.MANAGER);
export const RoleStaff = Roles(ROLES.STAFF);
export const RoleCustomer = Roles(ROLES.CUSTOMER);
