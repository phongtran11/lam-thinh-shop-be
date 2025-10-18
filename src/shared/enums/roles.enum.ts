export enum RoleEnum {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export const RoleHierarchy = {
  [RoleEnum.CUSTOMER]: 1,
  [RoleEnum.STAFF]: 2,
  [RoleEnum.MANAGER]: 3,
  [RoleEnum.ADMIN]: 4,
} as const;

export type RoleHierarchyEnum =
  (typeof RoleHierarchy)[keyof typeof RoleHierarchy];

export const RoleDescriptions = {
  [RoleEnum.CUSTOMER]: 'Khách hàng - Truy cập cửa hàng trực tuyến',
  [RoleEnum.STAFF]: 'Nhân viên - Quản lý đơn hàng và sản phẩm cơ bản',
  [RoleEnum.MANAGER]:
    'Quản lý - Truy cập đầy đủ dashboard trừ quản lý người dùng',
  [RoleEnum.ADMIN]: 'Quản trị viên - Quyền truy cập toàn hệ thống',
};
