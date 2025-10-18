import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseLogger } from 'src/shared/loggers/db.logger';
import { BaseEntitySubscriber } from 'src/shared/subscribers/base-entity.subscriber';

export const DATABASE = 'database';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  logger: new DatabaseLogger(),
  subscribers: [BaseEntitySubscriber],
};

export const dataSource = new DataSource(dataSourceOptions);

export const databaseConfig = registerAs(
  DATABASE,
  (): TypeOrmModuleOptions => dataSourceOptions,
);
