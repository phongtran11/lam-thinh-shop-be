export enum RoleEnum {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  MANAGER = 'manager',
  SUPER_ADMIN = 'super_admin',
}

export const RoleHierarchy = {
  [RoleEnum.CUSTOMER]: 1,
  [RoleEnum.STAFF]: 2,
  [RoleEnum.MANAGER]: 3,
  [RoleEnum.SUPER_ADMIN]: 4,
};

export const RoleDescriptions = {
  [RoleEnum.CUSTOMER]: 'Khách hàng - Truy cập cửa hàng trực tuyến',
  [RoleEnum.STAFF]: 'Nhân viên - Quản lý đơn hàng và sản phẩm cơ bản',
  [RoleEnum.MANAGER]:
    'Quản lý - Truy cập đầy đủ dashboard trừ quản lý người dùng',
  [RoleEnum.SUPER_ADMIN]: 'Quản trị viên - Quyền truy cập toàn hệ thống',
};
