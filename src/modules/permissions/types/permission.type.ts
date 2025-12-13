import {
  ACTIONS,
  PERMISSIONS,
  RESOURCES,
} from '../constants/permission.constant';

export type Resources = (typeof RESOURCES)[keyof typeof RESOURCES];

export type Actions = (typeof ACTIONS)[keyof typeof ACTIONS];

export type Permissions = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
