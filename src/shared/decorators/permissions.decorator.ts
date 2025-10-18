import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from 'src/shared/enums/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: PermissionEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// Users Permissions Decorators
export const PermissionUsersCreate = () =>
  Permissions(PermissionEnum.USERS_CREATE);
export const PermissionUsersRead = () => Permissions(PermissionEnum.USERS_READ);
export const PermissionUsersUpdate = () =>
  Permissions(PermissionEnum.USERS_UPDATE);
export const PermissionUsersDelete = () =>
  Permissions(PermissionEnum.USERS_DELETE);

// Roles Permissions Decorators
export const PermissionRolesCreate = () =>
  Permissions(PermissionEnum.ROLES_CREATE);
export const PermissionRolesRead = () => Permissions(PermissionEnum.ROLES_READ);
export const PermissionRolesUpdate = () =>
  Permissions(PermissionEnum.ROLES_UPDATE);
export const PermissionRolesDelete = () =>
  Permissions(PermissionEnum.ROLES_DELETE);

// Permissions Management Decorators
export const PermissionPermissionsCreate = () =>
  Permissions(PermissionEnum.PERMISSIONS_CREATE);
export const PermissionPermissionsRead = () =>
  Permissions(PermissionEnum.PERMISSIONS_READ);
export const PermissionPermissionsUpdate = () =>
  Permissions(PermissionEnum.PERMISSIONS_UPDATE);
export const PermissionPermissionsDelete = () =>
  Permissions(PermissionEnum.PERMISSIONS_DELETE);

// Products Permissions Decorators
export const PermissionProductsCreate = () =>
  Permissions(PermissionEnum.PRODUCTS_CREATE);
export const PermissionProductsRead = () =>
  Permissions(PermissionEnum.PRODUCTS_READ);
export const PermissionProductsUpdate = () =>
  Permissions(PermissionEnum.PRODUCTS_UPDATE);
export const PermissionProductsDelete = () =>
  Permissions(PermissionEnum.PRODUCTS_DELETE);

// Categories Permissions Decorators
export const PermissionCategoriesCreate = () =>
  Permissions(PermissionEnum.CATEGORIES_CREATE);
export const PermissionCategoriesRead = () =>
  Permissions(PermissionEnum.CATEGORIES_READ);
export const PermissionCategoriesUpdate = () =>
  Permissions(PermissionEnum.CATEGORIES_UPDATE);
export const PermissionCategoriesDelete = () =>
  Permissions(PermissionEnum.CATEGORIES_DELETE);
