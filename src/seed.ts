import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  RoleDescriptions,
  RoleEnum,
  RoleHierarchy,
} from './shared/enums/roles.enum';
import { User } from './modules/users/entities/user.entity';
import { Role } from './modules/roles/entities/role.entity';
import { Permission } from './modules/roles/entities/permission.entity';
import { PermissionEnum, ResourceEnum } from './shared/enums/permissions.enum';
import { PermissionRepository } from './modules/roles/repositories/permission.repository';
import { RolePermissionsRepository } from './modules/roles/repositories/role-permissions.repository';
import { RoleRepository } from './modules/roles/repositories/role.repository';
import { UsersRepository } from './modules/users/repositories/users.repository';
import { In } from 'typeorm';
import { EncryptionService } from './shared/services/encryption.service';
import { RefreshTokensRepository } from './modules/auth/repositories/refresh-token.repository';

const initUsers: Array<Partial<User> & { roleName: RoleEnum }> = [
  {
    email: 'admin@gmail.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    phoneNumber: '0123456789',
    roleName: RoleEnum.ADMIN,
  },
  {
    email: 'manager@gmail.com',
    password: 'test1234',
    firstName: 'Manager',
    lastName: 'User',
    phoneNumber: '0123456789',
    roleName: RoleEnum.MANAGER,
  },
  {
    email: 'staff@gmail.com',
    password: 'test1234',
    firstName: 'Staff',
    lastName: 'User',
    phoneNumber: '0123456789',
    roleName: RoleEnum.STAFF,
  },
  {
    email: 'customer@gmail.com',
    password: 'test1234',
    firstName: 'Customer',
    lastName: 'User',
    phoneNumber: '0123456789',
    roleName: RoleEnum.CUSTOMER,
  },
];

const initRoles: Array<Partial<Role> & { permissionNames: PermissionEnum[] }> =
  [
    {
      name: RoleEnum.ADMIN,
      displayName: 'Administrator',
      description: RoleDescriptions[RoleEnum.ADMIN],
      level: RoleHierarchy[RoleEnum.ADMIN],
      permissionNames: [
        PermissionEnum.USERS_CREATE,
        PermissionEnum.USERS_READ,
        PermissionEnum.USERS_UPDATE,
        PermissionEnum.USERS_DELETE,
        PermissionEnum.ROLES_CREATE,
        PermissionEnum.ROLES_READ,
        PermissionEnum.ROLES_UPDATE,
        PermissionEnum.ROLES_DELETE,
        PermissionEnum.PERMISSIONS_CREATE,
        PermissionEnum.PERMISSIONS_READ,
        PermissionEnum.PERMISSIONS_UPDATE,
        PermissionEnum.PERMISSIONS_DELETE,
        PermissionEnum.PRODUCTS_CREATE,
        PermissionEnum.PRODUCTS_READ,
        PermissionEnum.PRODUCTS_UPDATE,
        PermissionEnum.PRODUCTS_DELETE,
        PermissionEnum.CATEGORIES_CREATE,
        PermissionEnum.CATEGORIES_READ,
        PermissionEnum.CATEGORIES_UPDATE,
        PermissionEnum.CATEGORIES_DELETE,
      ],
    },
    {
      name: RoleEnum.MANAGER,
      displayName: 'Manager',
      description: RoleDescriptions[RoleEnum.MANAGER],
      level: RoleHierarchy[RoleEnum.MANAGER],
      permissionNames: [
        PermissionEnum.USERS_CREATE,
        PermissionEnum.USERS_READ,
        PermissionEnum.USERS_UPDATE,
        PermissionEnum.USERS_DELETE,
        PermissionEnum.PRODUCTS_CREATE,
        PermissionEnum.PRODUCTS_READ,
        PermissionEnum.PRODUCTS_UPDATE,
        PermissionEnum.PRODUCTS_DELETE,
        PermissionEnum.CATEGORIES_CREATE,
        PermissionEnum.CATEGORIES_READ,
        PermissionEnum.CATEGORIES_UPDATE,
        PermissionEnum.CATEGORIES_DELETE,
      ],
    },
    {
      name: RoleEnum.STAFF,
      displayName: 'Staff',
      description: RoleDescriptions[RoleEnum.STAFF],
      level: RoleHierarchy[RoleEnum.STAFF],
      permissionNames: [
        PermissionEnum.PRODUCTS_CREATE,
        PermissionEnum.PRODUCTS_READ,
        PermissionEnum.PRODUCTS_UPDATE,
        PermissionEnum.PRODUCTS_DELETE,
        PermissionEnum.CATEGORIES_CREATE,
        PermissionEnum.CATEGORIES_READ,
        PermissionEnum.CATEGORIES_UPDATE,
        PermissionEnum.CATEGORIES_DELETE,
      ],
    },
    {
      name: RoleEnum.CUSTOMER,
      displayName: 'Customer',
      description: RoleDescriptions[RoleEnum.CUSTOMER],
      level: RoleHierarchy[RoleEnum.CUSTOMER],
      permissionNames: [
        PermissionEnum.PRODUCTS_READ,
        PermissionEnum.CATEGORIES_READ,
      ],
    },
  ];

const initPermissions: Array<Partial<Permission>> = [
  {
    name: PermissionEnum.USERS_READ,
    displayName: 'Read Users',
    description: 'Permission to read user information',
    resource: ResourceEnum.USERS,
  },
  {
    name: PermissionEnum.USERS_CREATE,
    displayName: 'Create Users',
    description: 'Permission to create new users',
    resource: ResourceEnum.USERS,
  },
  {
    name: PermissionEnum.USERS_UPDATE,
    displayName: 'Update Users',
    description: 'Permission to update user information',
    resource: ResourceEnum.USERS,
  },
  {
    name: PermissionEnum.USERS_DELETE,
    displayName: 'Delete Users',
    description: 'Permission to delete users',
    resource: ResourceEnum.USERS,
  },
  {
    name: PermissionEnum.PRODUCTS_READ,
    displayName: 'Read Products',
    description: 'Permission to read product information',
    resource: ResourceEnum.PRODUCTS,
  },
  {
    name: PermissionEnum.PRODUCTS_CREATE,
    displayName: 'Create Products',
    description: 'Permission to create new products',
    resource: ResourceEnum.PRODUCTS,
  },
  {
    name: PermissionEnum.PRODUCTS_UPDATE,
    displayName: 'Update Products',
    description: 'Permission to update product information',
    resource: ResourceEnum.PRODUCTS,
  },
  {
    name: PermissionEnum.PRODUCTS_DELETE,
    displayName: 'Delete Products',
    description: 'Permission to delete products',
    resource: ResourceEnum.PRODUCTS,
  },
  {
    name: PermissionEnum.CATEGORIES_READ,
    displayName: 'Read Categories',
    description: 'Permission to read category information',
    resource: ResourceEnum.CATEGORIES,
  },
  {
    name: PermissionEnum.CATEGORIES_CREATE,
    displayName: 'Create Categories',
    description: 'Permission to create new categories',
    resource: ResourceEnum.CATEGORIES,
  },
  {
    name: PermissionEnum.CATEGORIES_UPDATE,
    displayName: 'Update Categories',
    description: 'Permission to update category information',
    resource: ResourceEnum.CATEGORIES,
  },
  {
    name: PermissionEnum.CATEGORIES_DELETE,
    displayName: 'Delete Categories',
    description: 'Permission to delete categories',
    resource: ResourceEnum.CATEGORIES,
  },
  {
    name: PermissionEnum.ROLES_READ,
    displayName: 'Read Roles',
    description: 'Permission to read role information',
    resource: ResourceEnum.ROLES,
  },
  {
    name: PermissionEnum.ROLES_CREATE,
    displayName: 'Create Roles',
    description: 'Permission to create new roles',
    resource: ResourceEnum.ROLES,
  },
  {
    name: PermissionEnum.ROLES_UPDATE,
    displayName: 'Update Roles',
    description: 'Permission to update role information',
    resource: ResourceEnum.ROLES,
  },
  {
    name: PermissionEnum.ROLES_DELETE,
    displayName: 'Delete Roles',
    description: 'Permission to delete roles',
    resource: ResourceEnum.ROLES,
  },
  {
    name: PermissionEnum.PERMISSIONS_READ,
    displayName: 'Read Permissions',
    description: 'Permission to read permission information',
    resource: ResourceEnum.PERMISSIONS,
  },
  {
    name: PermissionEnum.PERMISSIONS_CREATE,
    displayName: 'Create Permissions',
    description: 'Permission to create new permissions',
    resource: ResourceEnum.PERMISSIONS,
  },
  {
    name: PermissionEnum.PERMISSIONS_UPDATE,
    displayName: 'Update Permissions',
    description: 'Permission to update permission information',
    resource: ResourceEnum.PERMISSIONS,
  },
  {
    name: PermissionEnum.PERMISSIONS_DELETE,
    displayName: 'Delete Permissions',
    description: 'Permission to delete permissions',
    resource: ResourceEnum.PERMISSIONS,
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const permissionRepository = app.get(PermissionRepository);
  const roleRepository = app.get(RoleRepository);
  const rolePermissionsRepository = app.get(RolePermissionsRepository);
  const userRepository = app.get(UsersRepository);
  const encryptionService = app.get(EncryptionService);
  const refreshTokenRepository = app.get(RefreshTokensRepository);

  console.log('🌱 Starting database seeding...\n');

  console.log('🧩 Clearing existing data...');
  await refreshTokenRepository.deleteAll();
  await userRepository.deleteAll();
  await rolePermissionsRepository.deleteAll();
  await roleRepository.deleteAll();
  await permissionRepository.deleteAll();
  console.log('✅ Existing data cleared\n');

  // Upsert permissions
  console.log('📋 Seeding permissions...');
  const permissions = initPermissions.map((permission) =>
    permissionRepository.create(permission),
  );

  await permissionRepository.insert(permissions);

  console.log(`✅ Successfully seeded ${initPermissions.length} permissions\n`);

  // Upsert roles with permissions
  console.log('👥 Seeding roles...');
  for (const roleData of initRoles) {
    const { permissionNames, ...roleInfo } = roleData;

    const role = await roleRepository.insert(roleInfo);
    const permissions = await permissionRepository.find({
      where: { name: In(permissionNames) },
    });

    const rolePermissions = permissions.map((permission) =>
      rolePermissionsRepository.create({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        roleId: role.identifiers[0].id,
        permissionId: permission.id,
      }),
    );

    await rolePermissionsRepository.insert(rolePermissions);
  }

  console.log(`✅ Successfully seeded ${initRoles.length} roles\n`);

  // Upsert users with roles
  console.log('🧑 Seeding users...');
  for (const userData of initUsers) {
    const { roleName, ...userInfo } = userData;

    const role = await roleRepository.findOne({
      where: { name: roleName },
    });

    if (!role) {
      console.warn(
        `⚠️  Role ${roleName} not found, skipping user ${userData.email}`,
      );
      continue;
    }

    const hashedPassword = await encryptionService.hash(userInfo.password!);
    await userRepository.save({ ...userInfo, role, password: hashedPassword });
    console.log(`  ✓ ${userInfo.email} (${roleName})`);
  }
  console.log(`✅ Successfully seeded ${initUsers.length} users\n`);

  console.log('🎉 Seed data upserted successfully!\n');

  await app.close();
}

void bootstrap();
