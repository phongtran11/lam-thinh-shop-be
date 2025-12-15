import { Permission } from '../entities/permission.entity';
import { PERMISSIONS, RESOURCES } from './permission.constant';

export const INIT_PERMISSIONS: Array<Partial<Permission>> = [
  {
    name: PERMISSIONS.USERS_READ,
    displayName: 'Read Users',
    description: 'Permission to read user information',
    resource: RESOURCES.USERS,
  },
  {
    name: PERMISSIONS.USERS_CREATE,
    displayName: 'Create Users',
    description: 'Permission to create new users',
    resource: RESOURCES.USERS,
  },
  {
    name: PERMISSIONS.USERS_UPDATE,
    displayName: 'Update Users',
    description: 'Permission to update user information',
    resource: RESOURCES.USERS,
  },
  {
    name: PERMISSIONS.USERS_DELETE,
    displayName: 'Delete Users',
    description: 'Permission to delete users',
    resource: RESOURCES.USERS,
  },
  {
    name: PERMISSIONS.PRODUCTS_READ,
    displayName: 'Read Products',
    description: 'Permission to read product information',
    resource: RESOURCES.PRODUCTS,
  },
  {
    name: PERMISSIONS.PRODUCTS_CREATE,
    displayName: 'Create Products',
    description: 'Permission to create new products',
    resource: RESOURCES.PRODUCTS,
  },
  {
    name: PERMISSIONS.PRODUCTS_UPDATE,
    displayName: 'Update Products',
    description: 'Permission to update product information',
    resource: RESOURCES.PRODUCTS,
  },
  {
    name: PERMISSIONS.PRODUCTS_DELETE,
    displayName: 'Delete Products',
    description: 'Permission to delete products',
    resource: RESOURCES.PRODUCTS,
  },
  {
    name: PERMISSIONS.CATEGORIES_READ,
    displayName: 'Read Categories',
    description: 'Permission to read category information',
    resource: RESOURCES.CATEGORIES,
  },
  {
    name: PERMISSIONS.CATEGORIES_CREATE,
    displayName: 'Create Categories',
    description: 'Permission to create new categories',
    resource: RESOURCES.CATEGORIES,
  },
  {
    name: PERMISSIONS.CATEGORIES_UPDATE,
    displayName: 'Update Categories',
    description: 'Permission to update category information',
    resource: RESOURCES.CATEGORIES,
  },
  {
    name: PERMISSIONS.CATEGORIES_DELETE,
    displayName: 'Delete Categories',
    description: 'Permission to delete categories',
    resource: RESOURCES.CATEGORIES,
  },
  {
    name: PERMISSIONS.ROLES_READ,
    displayName: 'Read Roles',
    description: 'Permission to read role information',
    resource: RESOURCES.ROLES,
  },
  {
    name: PERMISSIONS.ROLES_CREATE,
    displayName: 'Create Roles',
    description: 'Permission to create new roles',
    resource: RESOURCES.ROLES,
  },
  {
    name: PERMISSIONS.ROLES_UPDATE,
    displayName: 'Update Roles',
    description: 'Permission to update role information',
    resource: RESOURCES.ROLES,
  },
  {
    name: PERMISSIONS.ROLES_DELETE,
    displayName: 'Delete Roles',
    description: 'Permission to delete roles',
    resource: RESOURCES.ROLES,
  },
  {
    name: PERMISSIONS.PERMISSIONS_READ,
    displayName: 'Read Permissions',
    description: 'Permission to read permission information',
    resource: RESOURCES.PERMISSIONS,
  },
  {
    name: PERMISSIONS.PERMISSIONS_CREATE,
    displayName: 'Create Permissions',
    description: 'Permission to create new permissions',
    resource: RESOURCES.PERMISSIONS,
  },
  {
    name: PERMISSIONS.PERMISSIONS_UPDATE,
    displayName: 'Update Permissions',
    description: 'Permission to update permission information',
    resource: RESOURCES.PERMISSIONS,
  },
  {
    name: PERMISSIONS.PERMISSIONS_DELETE,
    displayName: 'Delete Permissions',
    description: 'Permission to delete permissions',
    resource: RESOURCES.PERMISSIONS,
  },
];
