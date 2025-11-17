import { registerAs } from '@nestjs/config';

export const JWT_ACCESS_TOKEN_CONFIG = 'jwtAccessTokenConfig';
export const JWT_REFRESH_TOKEN_CONFIG = 'jwtRefreshTokenConfig';

export const jwtAccessTokenMap = {
  secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  expiredIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION ?? ''),
};

export type TJwtAccessTokenConfig = typeof jwtAccessTokenMap;

export const jwtAccessTokenConfig = registerAs(
  JWT_ACCESS_TOKEN_CONFIG,
  () => jwtAccessTokenMap,
);

export const jwtRefreshTokenMap = {
  secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  expiredIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION ?? ''),
};

export type TJwtRefreshTokenConfig = typeof jwtRefreshTokenMap;

export const jwtRefreshTokenConfig = registerAs(
  JWT_REFRESH_TOKEN_CONFIG,
  () => jwtRefreshTokenMap,
);
