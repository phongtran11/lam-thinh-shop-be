import { ROLES, ROLE_DESCRIPTION } from '../constants/role.constant';

export type Roles = (typeof ROLES)[keyof typeof ROLES];

export type RoleDescription =
  (typeof ROLE_DESCRIPTION)[keyof typeof ROLE_DESCRIPTION];
