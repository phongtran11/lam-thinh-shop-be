import { registerAs } from '@nestjs/config';

export const commonConfigMap = {
  appName: process.env.APP_NAME || 'NODEJS_APPLICATION',
  appVersion: process.env.APP_VERSION || '1.0.0',
  appPort: parseInt(process.env.APP_PORT || '3000', 10),
  appEnv: process.env.APP_ENV || 'development',
} as const;

export type TCommonConfig = typeof commonConfigMap;

export const COMMON_CONFIG = 'commonConfig';

export const commonConfig = registerAs(COMMON_CONFIG, () => commonConfigMap);
