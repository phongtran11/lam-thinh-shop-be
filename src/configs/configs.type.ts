import { COMMON_CONFIG, TCommonConfig } from './common.config';
import { DATABASE } from './database.config';
import {
  JWT_ACCESS_TOKEN_CONFIG,
  JWT_REFRESH_TOKEN_CONFIG,
  TJwtAccessTokenConfig,
  TJwtRefreshTokenConfig,
} from './jwt.config';

export type TConfigs = {
  [DATABASE]: {
    url: string;
  };
  [COMMON_CONFIG]: TCommonConfig;
  [JWT_ACCESS_TOKEN_CONFIG]: TJwtAccessTokenConfig;
  [JWT_REFRESH_TOKEN_CONFIG]: TJwtRefreshTokenConfig;
};
