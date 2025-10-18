import { DATABASE } from './database.config';
import {
  JWT_ACCESS_TOKEN_CONFIG,
  JWT_REFRESH_TOKEN_CONFIG,
  JwtAccessTokenOptions,
  RefreshJwtOptions,
} from './jwt.config';

export type Configs = {
  [DATABASE]: {
    url: string;
  };
  [JWT_ACCESS_TOKEN_CONFIG]: JwtAccessTokenOptions;
  [JWT_REFRESH_TOKEN_CONFIG]: RefreshJwtOptions;
};
