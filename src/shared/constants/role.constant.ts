export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  STAFF: 'STAFF',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
} as const;

export type ERoles = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY = {
  CUSTOMER: 1,
  STAFF: 2,
  MANAGER: 3,
  ADMIN: 4,
} as const;

export type ERoleHierarchy =
  (typeof ROLE_HIERARCHY)[keyof typeof ROLE_HIERARCHY];

export const ROLE_DESCRIPTION = {
  CUSTOMER: 'Khách hàng - Truy cập cửa hàng trực tuyến',
  STAFF: 'Nhân viên - Quản lý đơn hàng và sản phẩm cơ bản',
  MANAGER: 'Quản lý - Truy cập đầy đủ dashboard trừ quản lý người dùng',
  ADMIN: 'Quản trị viên - Quyền truy cập toàn hệ thống',
} as const;

export type ERoleDescription =
  (typeof ROLE_DESCRIPTION)[keyof typeof ROLE_DESCRIPTION];
