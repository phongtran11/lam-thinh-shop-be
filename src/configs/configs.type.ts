import { JwtOptions, RefreshJwtOptions } from './jwt.config';

export type Configs = {
  database: {
    url: string;
  };
  jwt: JwtOptions;
  refreshJwt: RefreshJwtOptions;
};
