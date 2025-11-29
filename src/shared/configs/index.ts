/**
 * Centralized configuration
 * All environment variables should be accessed through this configurations object
 */

export const configurations = () => ({
  app: {
    name: process.env.APP_NAME || 'NODEJS_APPLICATION',
    version: process.env.APP_VERSION || '1.0.0',
    port: parseInt(process.env.APP_PORT || '3000', 10),
    env: process.env.APP_ENV || 'development',
  },

  database: {
    url: process.env.DB_URL || '',
  },

  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || '',
      expiration: parseInt(
        process.env.JWT_ACCESS_TOKEN_EXPIRATION || '86400',
        10,
      ),
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET || '',
      expiration: parseInt(
        process.env.JWT_REFRESH_TOKEN_EXPIRATION || '604800',
        10,
      ),
    },
  },
});

export type Configurations = ReturnType<typeof configurations>;
