import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'pino-nestjs';
import { TConfigs } from 'src/configs/configs.type';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService<TConfigs>) => {
        const appEnv = configService.getOrThrow('common.appEnv', {
          infer: true,
        });
        return {
          pinoHttp: {
            redact: {
              paths: ['req.headers.authorization', 'req.headers.cookie'],
              censor: '*****',
            },
            level: appEnv !== 'production' ? 'debug' : 'info',
            transport: {
              targets: [
                {
                  level: appEnv !== 'production' ? 'debug' : 'info',
                  target: 'pino-pretty',
                  options: { color: true },
                },
              ],
            },
          },
          forRoutes: ['*path'],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class PinoLoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: PinoLoggerModule,
    };
  }
}
