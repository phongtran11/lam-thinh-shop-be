import { SetMetadata } from '@nestjs/common';
import {
  EPermissions,
  PERMISSIONS,
} from 'src/shared/constants/permission.constant';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: EPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// Users Permissions Decorators
export const PermissionUsersCreate = () =>
  Permissions(PERMISSIONS.USERS_CREATE);
export const PermissionUsersRead = () => Permissions(PERMISSIONS.USERS_READ);
export const PermissionUsersUpdate = () =>
  Permissions(PERMISSIONS.USERS_UPDATE);
export const PermissionUsersDelete = () =>
  Permissions(PERMISSIONS.USERS_DELETE);

// Roles Permissions Decorators
export const PermissionRolesCreate = () =>
  Permissions(PERMISSIONS.ROLES_CREATE);
export const PermissionRolesRead = () => Permissions(PERMISSIONS.ROLES_READ);
export const PermissionRolesUpdate = () =>
  Permissions(PERMISSIONS.ROLES_UPDATE);
export const PermissionRolesDelete = () =>
  Permissions(PERMISSIONS.ROLES_DELETE);

// Permissions Management Decorators
export const PermissionPermissionsCreate = () =>
  Permissions(PERMISSIONS.PERMISSIONS_CREATE);
export const PermissionPermissionsRead = () =>
  Permissions(PERMISSIONS.PERMISSIONS_READ);
export const PermissionPermissionsUpdate = () =>
  Permissions(PERMISSIONS.PERMISSIONS_UPDATE);
export const PermissionPermissionsDelete = () =>
  Permissions(PERMISSIONS.PERMISSIONS_DELETE);

// Products Permissions Decorators
export const PermissionProductsCreate = () =>
  Permissions(PERMISSIONS.PRODUCTS_CREATE);
export const PermissionProductsRead = () =>
  Permissions(PERMISSIONS.PRODUCTS_READ);
export const PermissionProductsUpdate = () =>
  Permissions(PERMISSIONS.PRODUCTS_UPDATE);
export const PermissionProductsDelete = () =>
  Permissions(PERMISSIONS.PRODUCTS_DELETE);

// Categories Permissions Decorators
export const PermissionCategoriesCreate = () =>
  Permissions(PERMISSIONS.CATEGORIES_CREATE);
export const PermissionCategoriesRead = () =>
  Permissions(PERMISSIONS.CATEGORIES_READ);
export const PermissionCategoriesUpdate = () =>
  Permissions(PERMISSIONS.CATEGORIES_UPDATE);
export const PermissionCategoriesDelete = () =>
  Permissions(PERMISSIONS.CATEGORIES_DELETE);
