import { Injectable } from '@nestjs/common';
import {
  PermissionEnum as PermissionEnum,
  ResourceEnum,
} from 'src/shared/enums/permissions.enum';
import { Logger } from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionResponseDto } from '../dto/permission-response.dto';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { ClsService } from 'nestjs-cls';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly clsService: ClsService,
  ) {}

  async findOwnedPermissions(): Promise<PermissionResponseDto[]> {
    const userId = this.clsService.get<JwtPayload>('user').sub;

    const permissions =
      await this.permissionRepository.findOwnedPermissions(userId);

    return plainToInstance(PermissionResponseDto, permissions);
  }

  async seedDefaultPermissions(): Promise<void> {
    this.logger.log('Seeding default permissions...');

    const permissionData = [
      // 👥 USER PERMISSIONS
      {
        name: PermissionEnum.USERS_CREATE,
        displayName: 'Create Users',
        description: 'Permission to create new users in the system',
        resource: ResourceEnum.USERS,
        isActive: true,
      },
      {
        name: PermissionEnum.USERS_READ,
        displayName: 'Read Users',
        description: 'Permission to read user information',
        resource: ResourceEnum.USERS,
        isActive: true,
      },
      {
        name: PermissionEnum.USERS_UPDATE,
        displayName: 'Update Users',
        description: 'Permission to update user information',
        resource: ResourceEnum.USERS,
        isActive: true,
      },
      {
        name: PermissionEnum.USERS_DELETE,
        displayName: 'Delete Users',
        description: 'Permission to delete users from the system',
        resource: ResourceEnum.USERS,
        isActive: true,
      },

      // 🔐 ROLE PERMISSIONS
      {
        name: PermissionEnum.ROLES_CREATE,
        displayName: 'Create Roles',
        description: 'Permission to create new roles in the system',
        resource: ResourceEnum.ROLES,
        isActive: true,
      },
      {
        name: PermissionEnum.ROLES_READ,
        displayName: 'Read Roles',
        description: 'Permission to view roles and permissions',
        resource: ResourceEnum.ROLES,
        isActive: true,
      },
      {
        name: PermissionEnum.ROLES_UPDATE,
        displayName: 'Update Roles',
        description: 'Permission to update roles and assign permissions',
        resource: ResourceEnum.ROLES,
        isActive: true,
      },
      {
        name: PermissionEnum.ROLES_DELETE,
        displayName: 'Delete Roles',
        description: 'Permission to delete roles from the system',
        resource: ResourceEnum.ROLES,
        isActive: true,
      },

      {
        name: PermissionEnum.PRODUCTS_CREATE,
        displayName: 'Create Products',
        description: 'Permission to add new products to the store',
        resource: ResourceEnum.PRODUCTS,
        isActive: true,
      },
      {
        name: PermissionEnum.PRODUCTS_READ,
        displayName: 'Read Products',
        description: 'Permission to view product information',
        resource: ResourceEnum.PRODUCTS,
        isActive: true,
      },
      {
        name: PermissionEnum.PRODUCTS_UPDATE,
        displayName: 'Update Products',
        description: 'Permission to modify product information',
        resource: ResourceEnum.PRODUCTS,
        isActive: true,
      },
      {
        name: PermissionEnum.PRODUCTS_DELETE,
        displayName: 'Delete Products',
        description: 'Permission to remove products from the store',
        resource: ResourceEnum.PRODUCTS,
        isActive: true,
      },

      // 📂 CATEGORY PERMISSIONS
      {
        name: PermissionEnum.CATEGORIES_CREATE,
        displayName: 'Create Categories',
        description: 'Permission to create new product categories',
        resource: ResourceEnum.CATEGORIES,
        isActive: true,
      },
      {
        name: PermissionEnum.CATEGORIES_READ,
        displayName: 'Read Categories',
        description: 'Permission to view category information',
        resource: ResourceEnum.CATEGORIES,
        isActive: true,
      },
      {
        name: PermissionEnum.CATEGORIES_UPDATE,
        displayName: 'Update Categories',
        description: 'Permission to modify category information',
        resource: ResourceEnum.CATEGORIES,
        isActive: true,
      },
      {
        name: PermissionEnum.CATEGORIES_DELETE,
        displayName: 'Delete Categories',
        description: 'Permission to remove categories from the system',
        resource: ResourceEnum.CATEGORIES,
        isActive: true,
      },
    ];

    for (const permission of permissionData) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: permission.name },
      });

      if (!existingPermission) {
        const newPermission = this.permissionRepository.create(permission);
        await this.permissionRepository.save(newPermission);
        this.logger.log(`Created permission: ${permission.displayName}`);
      }
    }

    this.logger.log('Default permissions seeded successfully');
  }
}
