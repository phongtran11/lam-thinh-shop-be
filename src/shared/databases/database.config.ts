import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { RolePermissions } from 'src/modules/roles/entities/role-permissions.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { configurations } from '../configs';
import { DatabaseLogger } from './database.logger';
import { BaseEntitySubscriber } from './subscribers/base-entity.subscriber';

export const datasourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: configurations().database.url,
  // entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  entities: [User, RefreshToken, Role, RolePermissions, Permission],
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  logger: new DatabaseLogger(),
  subscribers: [BaseEntitySubscriber],
};

export const databaseConfig = registerAs('database', () => datasourceOptions);

export default new DataSource(datasourceOptions);
