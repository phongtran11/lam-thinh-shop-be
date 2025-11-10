import { COMMON_CONFIG, TCommonConfig } from './common.config';
import { DATABASE } from './database.config';
import {
  JWT_ACCESS_TOKEN_CONFIG,
  JWT_REFRESH_TOKEN_CONFIG,
  TJwtAccessTokenOptions,
  TRefreshJwtOptions,
} from './jwt.config';

export type TConfigs = {
  [DATABASE]: {
    url: string;
  };
  [COMMON_CONFIG]: TCommonConfig;
  [JWT_ACCESS_TOKEN_CONFIG]: TJwtAccessTokenOptions;
  [JWT_REFRESH_TOKEN_CONFIG]: TRefreshJwtOptions;
};
