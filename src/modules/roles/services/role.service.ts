import { Injectable, Logger } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { RoleEnum as RoleEnum } from 'src/shared/enums/roles.enum';
import { PermissionEnum as PermissionEnum } from 'src/shared/enums/permissions.enum';
import { PermissionRepository } from '../repositories/permission.repository';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async seedDefaultRoles(): Promise<void> {
    this.logger.log('Seeding default roles...');

    const roles = [
      {
        name: RoleEnum.CUSTOMER,
        displayName: 'Customer',
        description: 'Khách hàng - Truy cập cửa hàng trực tuyến',
        level: 1,
        permissions: [
          PermissionEnum.USERS_READ,
          PermissionEnum.USERS_UPDATE,
          PermissionEnum.USERS_DELETE,
          PermissionEnum.PRODUCTS_READ,
        ],
      },
      {
        name: RoleEnum.STAFF,
        displayName: 'Staff',
        description: 'Nhân viên - Quản lý đơn hàng và sản phẩm cơ bản',
        level: 2,
        permissions: [
          PermissionEnum.PRODUCTS_CREATE,
          PermissionEnum.PRODUCTS_READ,
          PermissionEnum.PRODUCTS_UPDATE,
          PermissionEnum.PRODUCTS_DELETE,
        ],
      },
      {
        name: RoleEnum.MANAGER,
        displayName: 'Manager',
        description:
          'Quản lý - Truy cập đầy đủ dashboard trừ quản lý người dùng',
        level: 3,
        permissions: [
          PermissionEnum.PRODUCTS_CREATE,
          PermissionEnum.PRODUCTS_READ,
          PermissionEnum.PRODUCTS_UPDATE,
          PermissionEnum.PRODUCTS_DELETE,
        ],
      },
      {
        name: RoleEnum.SUPER_ADMIN,
        displayName: 'Super Admin',
        description: 'Quản trị viên - Quyền truy cập toàn hệ thống',
        level: 4,
        permissions: Object.values(PermissionEnum),
      },
    ];

    for (const roleData of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const permissions = await this.permissionRepository.find({
          where: roleData.permissions.map((p) => ({ name: p })),
        });

        const role = this.roleRepository.create({
          ...roleData,
          permissions,
        });

        await this.roleRepository.save(role);
        this.logger.log(`Created role: ${roleData.displayName}`);
      }
    }

    this.logger.log('Default roles seeded successfully');
  }
}
