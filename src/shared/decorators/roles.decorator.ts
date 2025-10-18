import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/shared/enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);

export const RoleAdmin = Roles(RoleEnum.ADMIN);
export const RoleManger = Roles(RoleEnum.MANAGER);
export const RoleStaff = Roles(RoleEnum.STAFF);
export const RoleCustomer = Roles(RoleEnum.CUSTOMER);
