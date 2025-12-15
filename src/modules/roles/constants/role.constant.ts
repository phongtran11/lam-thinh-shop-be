export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  STAFF: 'STAFF',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
} as const;

export const ROLE_DESCRIPTION = {
  CUSTOMER: 'Khách hàng - Truy cập cửa hàng trực tuyến',
  STAFF: 'Nhân viên - Quản lý đơn hàng và sản phẩm cơ bản',
  MANAGER: 'Quản lý - Truy cập đầy đủ dashboard trừ quản lý người dùng',
  ADMIN: 'Quản trị viên - Quyền truy cập toàn hệ thống',
} as const;
