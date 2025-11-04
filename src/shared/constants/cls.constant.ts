export const CLS_KEY = {
  JWT_PAYLOAD: 'jwtPayload',
} as const;

export type EClsKey = (typeof CLS_KEY)[keyof typeof CLS_KEY];
