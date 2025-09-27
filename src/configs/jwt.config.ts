import { registerAs } from '@nestjs/config';

export const jwtOptions = {
  secret: process.env.JWT_SECRET,
  expiredIn: parseInt(process.env.JWT_EXPIRED_IN ?? ''),
};

export type JwtOptions = typeof jwtOptions;

export const jwtConfig = registerAs('jwt', () => jwtOptions);

export const refreshJwtOptions = {
  secret: process.env.JWT_REFRESH_SECRET,
  expiredIn: parseInt(process.env.JWT_REFRESH_EXPIRED_IN ?? ''),
};

export type RefreshJwtOptions = typeof refreshJwtOptions;

export const refreshJwtConfig = registerAs(
  'refreshJwt',
  () => refreshJwtOptions,
);
