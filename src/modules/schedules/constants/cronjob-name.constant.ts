export const CRONJOB_NAME = {
  REFRESH_TOKEN_CLEANUP: 'refreshTokenCleanup',
} as const;

export type ECronJobName = (typeof CRONJOB_NAME)[keyof typeof CRONJOB_NAME];
