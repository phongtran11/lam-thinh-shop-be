import { SetMetadata } from '@nestjs/common';
import { Permissions, PERMISSIONS } from 'src/shared/constants';

export const PERMISSIONS_KEY = 'permissions';
export const RequiredPermissions = (...permissions: Permissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// Users Permissions Decorators
export const PermissionUsersCreate = RequiredPermissions(
  PERMISSIONS.USERS_CREATE,
);
export const PermissionUsersRead = RequiredPermissions(PERMISSIONS.USERS_READ);
export const PermissionUsersUpdate = RequiredPermissions(
  PERMISSIONS.USERS_UPDATE,
);
export const PermissionUsersDelete = RequiredPermissions(
  PERMISSIONS.USERS_DELETE,
);

// Roles Permissions Decorators
export const PermissionRolesCreate = RequiredPermissions(
  PERMISSIONS.ROLES_CREATE,
);
export const PermissionRolesRead = RequiredPermissions(PERMISSIONS.ROLES_READ);
export const PermissionRolesUpdate = RequiredPermissions(
  PERMISSIONS.ROLES_UPDATE,
);
export const PermissionRolesDelete = RequiredPermissions(
  PERMISSIONS.ROLES_DELETE,
);

// Permissions Management Decorators
export const PermissionPermissionsCreate = RequiredPermissions(
  PERMISSIONS.PERMISSIONS_CREATE,
);
export const PermissionPermissionsRead = RequiredPermissions(
  PERMISSIONS.PERMISSIONS_READ,
);
export const PermissionPermissionsUpdate = RequiredPermissions(
  PERMISSIONS.PERMISSIONS_UPDATE,
);
export const PermissionPermissionsDelete = RequiredPermissions(
  PERMISSIONS.PERMISSIONS_DELETE,
);

// Products Permissions Decorators
export const PermissionProductsCreate = RequiredPermissions(
  PERMISSIONS.PRODUCTS_CREATE,
);
export const PermissionProductsRead = RequiredPermissions(
  PERMISSIONS.PRODUCTS_READ,
);
export const PermissionProductsUpdate = RequiredPermissions(
  PERMISSIONS.PRODUCTS_UPDATE,
);
export const PermissionProductsDelete = RequiredPermissions(
  PERMISSIONS.PRODUCTS_DELETE,
);

// Categories Permissions Decorators
export const PermissionCategoriesCreate = RequiredPermissions(
  PERMISSIONS.CATEGORIES_CREATE,
);
export const PermissionCategoriesRead = RequiredPermissions(
  PERMISSIONS.CATEGORIES_READ,
);
export const PermissionCategoriesUpdate = RequiredPermissions(
  PERMISSIONS.CATEGORIES_UPDATE,
);
export const PermissionCategoriesDelete = RequiredPermissions(
  PERMISSIONS.CATEGORIES_DELETE,
);
