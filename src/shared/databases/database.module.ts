import { DataSourceOptions } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configurations } from 'src/shared/configs';
import { DatabaseLogger } from 'src/shared/loggers';
import { BaseEntitySubscriber } from 'src/shared/subscribers';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService<Configurations>) => {
            const dataSourceOptions: DataSourceOptions = {
              type: 'postgres',
              url: configService.getOrThrow('database.url', {
                infer: true,
              }),
              entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
              migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
              migrationsTableName: 'migrations',
              logger: new DatabaseLogger(),
              subscribers: [BaseEntitySubscriber],
            };

            return dataSourceOptions;
          },
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
