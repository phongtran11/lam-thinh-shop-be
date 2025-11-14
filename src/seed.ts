import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { User } from './modules/users/entities/user.entity';
import { UsersRepository } from './modules/users/repositories/users.repository';
import { In } from 'typeorm';
import { EncryptionService } from './shared/services/encryption.service';
import { RefreshTokensRepository } from './modules/auth/repositories/refresh-token.repository';
import {
  ERoles,
  ROLE_DESCRIPTION,
  ROLE_HIERARCHY,
  ROLES,
} from './shared/constants/role.constant';
import {
  EPermissions,
  PERMISSIONS,
  RESOURCES,
} from './shared/constants/permission.constant';
import { Role } from './modules/roles-permissions/entities/role.entity';
import { Permission } from './modules/roles-permissions/entities/permission.entity';
import { PermissionRepository } from './modules/roles-permissions/repositories/permission.repository';
import { RolePermissionsRepository } from './modules/roles-permissions/repositories/role-permissions.repository';
import { RoleRepository } from './modules/roles-permissions/repositories/role.repository';

const initUsers: Array<Partial<User> & { roleName: ERoles }> = [
  {
    email: 'admin@gmail.com',
    password: 'test@123',
    firstName: 'Admin',
    lastName: 'User',
    phoneNumber: '0123456789',
    roleName: ROLES.ADMIN,
  },
  {
    email: 'manager@gmail.com',
    password: 'test@123',
    firstName: 'Manager',
    lastName: 'User',
    phoneNumber: '0123456789',
    roleName: ROLES.MANAGER,
  },
  {
    email: 'staff@gmail.com',
    password: 'test@123',
    firstName: 'Staff',
    lastName: 'User',
    phoneNumber: '0123456789',
    roleName: ROLES.STAFF,
  },
  {
    email: 'customer@gmail.com',
    password: 'test@123',
    firstName: 'Customer',
    lastName: 'User',
    phoneNumber: '0123456789',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer1@gmail.com',
    password: 'test@123',
    firstName: 'John',
    lastName: 'Smith',
    phoneNumber: '0123456790',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer2@gmail.com',
    password: 'test@123',
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: '0123456791',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer3@gmail.com',
    password: 'test@123',
    firstName: 'Mike',
    lastName: 'Johnson',
    phoneNumber: '0123456792',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer4@gmail.com',
    password: 'test@123',
    firstName: 'Sarah',
    lastName: 'Wilson',
    phoneNumber: '0123456793',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer5@gmail.com',
    password: 'test@123',
    firstName: 'David',
    lastName: 'Brown',
    phoneNumber: '0123456794',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer6@gmail.com',
    password: 'test@123',
    firstName: 'Emily',
    lastName: 'Davis',
    phoneNumber: '0123456795',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer7@gmail.com',
    password: 'test@123',
    firstName: 'Chris',
    lastName: 'Miller',
    phoneNumber: '0123456796',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer8@gmail.com',
    password: 'test@123',
    firstName: 'Lisa',
    lastName: 'Taylor',
    phoneNumber: '0123456797',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer9@gmail.com',
    password: 'test@123',
    firstName: 'Robert',
    lastName: 'Anderson',
    phoneNumber: '0123456798',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer10@gmail.com',
    password: 'test@123',
    firstName: 'Jessica',
    lastName: 'Thomas',
    phoneNumber: '0123456799',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer11@gmail.com',
    password: 'test@123',
    firstName: 'Kevin',
    lastName: 'Jackson',
    phoneNumber: '0123456800',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer12@gmail.com',
    password: 'test@123',
    firstName: 'Amanda',
    lastName: 'White',
    phoneNumber: '0123456801',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer13@gmail.com',
    password: 'test@123',
    firstName: 'Ryan',
    lastName: 'Harris',
    phoneNumber: '0123456802',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer14@gmail.com',
    password: 'test@123',
    firstName: 'Nicole',
    lastName: 'Martin',
    phoneNumber: '0123456803',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer15@gmail.com',
    password: 'test@123',
    firstName: 'James',
    lastName: 'Thompson',
    phoneNumber: '0123456804',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer16@gmail.com',
    password: 'test@123',
    firstName: 'Rachel',
    lastName: 'Garcia',
    phoneNumber: '0123456805',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer17@gmail.com',
    password: 'test@123',
    firstName: 'Mark',
    lastName: 'Martinez',
    phoneNumber: '0123456806',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer18@gmail.com',
    password: 'test@123',
    firstName: 'Ashley',
    lastName: 'Robinson',
    phoneNumber: '0123456807',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer19@gmail.com',
    password: 'test@123',
    firstName: 'Brian',
    lastName: 'Clark',
    phoneNumber: '0123456808',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer20@gmail.com',
    password: 'test@123',
    firstName: 'Stephanie',
    lastName: 'Rodriguez',
    phoneNumber: '0123456809',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer21@gmail.com',
    password: 'test@123',
    firstName: 'Daniel',
    lastName: 'Lewis',
    phoneNumber: '0123456810',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer22@gmail.com',
    password: 'test@123',
    firstName: 'Michelle',
    lastName: 'Lee',
    phoneNumber: '0123456811',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer23@gmail.com',
    password: 'test@123',
    firstName: 'Anthony',
    lastName: 'Walker',
    phoneNumber: '0123456812',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer24@gmail.com',
    password: 'test@123',
    firstName: 'Laura',
    lastName: 'Hall',
    phoneNumber: '0123456813',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer25@gmail.com',
    password: 'test@123',
    firstName: 'Steven',
    lastName: 'Allen',
    phoneNumber: '0123456814',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer26@gmail.com',
    password: 'test@123',
    firstName: 'Karen',
    lastName: 'Young',
    phoneNumber: '0123456815',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer27@gmail.com',
    password: 'test@123',
    firstName: 'Jason',
    lastName: 'King',
    phoneNumber: '0123456816',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer28@gmail.com',
    password: 'test@123',
    firstName: 'Melissa',
    lastName: 'Wright',
    phoneNumber: '0123456817',
    roleName: ROLES.CUSTOMER,
  },
  {
    email: 'customer29@gmail.com',
    password: 'test@123',
    firstName: 'Matthew',
    lastName: 'Lopez',
    phoneNumber: '0123456818',
    roleName: ROLES.CUSTOMER,
  },
];

const initRoles: Array<Partial<Role> & { permissionNames: EPermissions[] }> = [
  {
    name: ROLES.ADMIN,
    displayName: 'Administrator',
    description: ROLE_DESCRIPTION[ROLES.ADMIN],
    level: ROLE_HIERARCHY[ROLES.ADMIN],
    permissionNames: [
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_READ,
      PERMISSIONS.USERS_UPDATE,
      PERMISSIONS.USERS_DELETE,
      PERMISSIONS.ROLES_CREATE,
      PERMISSIONS.ROLES_READ,
      PERMISSIONS.ROLES_UPDATE,
      PERMISSIONS.ROLES_DELETE,
      PERMISSIONS.PERMISSIONS_CREATE,
      PERMISSIONS.PERMISSIONS_READ,
      PERMISSIONS.PERMISSIONS_UPDATE,
      PERMISSIONS.PERMISSIONS_DELETE,
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_READ,
      PERMISSIONS.PRODUCTS_UPDATE,
      PERMISSIONS.PRODUCTS_DELETE,
      PERMISSIONS.CATEGORIES_CREATE,
      PERMISSIONS.CATEGORIES_READ,
      PERMISSIONS.CATEGORIES_UPDATE,
      PERMISSIONS.CATEGORIES_DELETE,
    ],
  },
  {
    name: ROLES.MANAGER,
    displayName: 'Manager',
    description: ROLE_DESCRIPTION[ROLES.MANAGER],
    level: ROLE_HIERARCHY[ROLES.MANAGER],
    permissionNames: [
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_READ,
      PERMISSIONS.USERS_UPDATE,
      PERMISSIONS.USERS_DELETE,
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_READ,
      PERMISSIONS.PRODUCTS_UPDATE,
      PERMISSIONS.PRODUCTS_DELETE,
      PERMISSIONS.CATEGORIES_CREATE,
      PERMISSIONS.CATEGORIES_READ,
      PERMISSIONS.CATEGORIES_UPDATE,
      PERMISSIONS.CATEGORIES_DELETE,
    ],
  },
  {
    name: ROLES.STAFF,
    displayName: 'Staff',
    description: ROLE_DESCRIPTION[ROLES.STAFF],
    level: ROLE_HIERARCHY[ROLES.STAFF],
    permissionNames: [
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_READ,
      PERMISSIONS.PRODUCTS_UPDATE,
      PERMISSIONS.PRODUCTS_DELETE,
      PERMISSIONS.CATEGORIES_CREATE,
      PERMISSIONS.CATEGORIES_READ,
      PERMISSIONS.CATEGORIES_UPDATE,
      PERMISSIONS.CATEGORIES_DELETE,
    ],
  },
  {
    name: ROLES.CUSTOMER,
    displayName: 'Customer',
    description: ROLE_DESCRIPTION[ROLES.CUSTOMER],
    level: ROLE_HIERARCHY[ROLES.CUSTOMER],
    permissionNames: [PERMISSIONS.PRODUCTS_READ, PERMISSIONS.CATEGORIES_READ],
  },
];

const initPermissions: Array<Partial<Permission>> = [
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
  console.log('📋 Seeding EPermissions...');
  const permissions = initPermissions.map((permission) =>
    permissionRepository.create(permission),
  );

  await permissionRepository.insert(permissions);

  console.log(`✅ Successfully seeded ${initPermissions.length} permissions\n`);

  // Upsert roles with permissions
  console.log('👥 Seeding ERoles...');
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
