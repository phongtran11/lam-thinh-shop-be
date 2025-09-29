import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/shared/enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);

export const RoleAdmin = () => Roles(RoleEnum.SUPER_ADMIN);

export const RoleManager = () => Roles(RoleEnum.MANAGER, RoleEnum.SUPER_ADMIN);

export const RoleStaff = () =>
  Roles(RoleEnum.STAFF, RoleEnum.MANAGER, RoleEnum.SUPER_ADMIN);

export const RoleCustomer = () =>
  Roles(
    RoleEnum.CUSTOMER,
    RoleEnum.STAFF,
    RoleEnum.MANAGER,
    RoleEnum.SUPER_ADMIN,
  );
