export enum ResourceEnum {
  PRODUCTS = 'products',
  ORDERS = 'orders',
  USERS = 'users',
  CATEGORIES = 'categories',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  SYSTEM = 'system',
}

export enum ActionEnum {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum PermissionEnum {
  // Users
  USERS_CREATE = `${ResourceEnum.USERS}:${ActionEnum.CREATE}`,
  USERS_READ = `${ResourceEnum.USERS}:${ActionEnum.READ}`,
  USERS_UPDATE = `${ResourceEnum.USERS}:${ActionEnum.UPDATE}`,
  USERS_DELETE = `${ResourceEnum.USERS}:${ActionEnum.DELETE}`,

  // Roles
  ROLES_CREATE = `${ResourceEnum.ROLES}:${ActionEnum.CREATE}`,
  ROLES_READ = `${ResourceEnum.ROLES}:${ActionEnum.READ}`,
  ROLES_UPDATE = `${ResourceEnum.ROLES}:${ActionEnum.UPDATE}`,
  ROLES_DELETE = `${ResourceEnum.ROLES}:${ActionEnum.DELETE}`,

  // Permissions
  PERMISSIONS_CREATE = `${ResourceEnum.PERMISSIONS}:${ActionEnum.CREATE}`,
  PERMISSIONS_READ = `${ResourceEnum.PERMISSIONS}:${ActionEnum.READ}`,
  PERMISSIONS_UPDATE = `${ResourceEnum.PERMISSIONS}:${ActionEnum.UPDATE}`,
  PERMISSIONS_DELETE = `${ResourceEnum.PERMISSIONS}:${ActionEnum.DELETE}`,

  // Products
  PRODUCTS_CREATE = `${ResourceEnum.PRODUCTS}:${ActionEnum.CREATE}`,
  PRODUCTS_READ = `${ResourceEnum.PRODUCTS}:${ActionEnum.READ}`,
  PRODUCTS_UPDATE = `${ResourceEnum.PRODUCTS}:${ActionEnum.UPDATE}`,
  PRODUCTS_DELETE = `${ResourceEnum.PRODUCTS}:${ActionEnum.DELETE}`,

  // Categories
  CATEGORIES_CREATE = `${ResourceEnum.CATEGORIES}:${ActionEnum.CREATE}`,
  CATEGORIES_READ = `${ResourceEnum.CATEGORIES}:${ActionEnum.READ}`,
  CATEGORIES_UPDATE = `${ResourceEnum.CATEGORIES}:${ActionEnum.UPDATE}`,
  CATEGORIES_DELETE = `${ResourceEnum.CATEGORIES}:${ActionEnum.DELETE}`,
}
