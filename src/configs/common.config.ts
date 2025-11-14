import { registerAs } from '@nestjs/config';

export const commonConfigOptions = {
  appName: process.env.APP_NAME || 'NODEJS_APPLICATION',
  appVersion: process.env.APP_VERSION || '1.0.0',
  appPort: parseInt(process.env.APP_PORT || '3000', 10),
  appEnv: process.env.APP_ENV || 'development',
} as const;

export type TCommonConfig = typeof commonConfigOptions;

export const COMMON_CONFIG = 'common';

export const commonConfig = registerAs(
  COMMON_CONFIG,
  () => commonConfigOptions,
);
