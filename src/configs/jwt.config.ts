import { registerAs } from '@nestjs/config';

export const JWT_ACCESS_TOKEN_CONFIG = 'jwtAccessToken';
export const JWT_REFRESH_TOKEN_CONFIG = 'jwtRefreshToken';

export const jwtAccessTokenOptions = {
  secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  expiredIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION ?? ''),
};

export type JwtAccessTokenOptions = typeof jwtAccessTokenOptions;

export const jwtAccessTokenConfig = registerAs(
  JWT_ACCESS_TOKEN_CONFIG,
  () => jwtAccessTokenOptions,
);

export const refreshJwtOptions = {
  secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  expiredIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION ?? ''),
};

export type RefreshJwtOptions = typeof refreshJwtOptions;

export const jwtRefreshTokenConfig = registerAs(
  JWT_REFRESH_TOKEN_CONFIG,
  () => refreshJwtOptions,
);
