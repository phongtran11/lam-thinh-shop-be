import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PermissionService } from './modules/roles/services/permission.service';
import { RoleService } from './modules/roles/services/role.service';
import { UsersService } from './modules/users/services/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const permissionService = app.get(PermissionService);
  const roleService = app.get(RoleService);
  const userService = app.get(UsersService);

  console.log('🌱 Starting database seeding...');

  try {
    // Seed permissions first
    await permissionService.seedDefaultPermissions();
    console.log('✅ Permissions seeded successfully');

    // Then seed roles
    await roleService.seedDefaultRoles();
    console.log('✅ Roles seeded successfully');

    // Finally, seed the admin user
    await userService.seedAdminUser();
    console.log('✅ Admin user seeded successfully');

    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }

  await app.close();
}

bootstrap();
