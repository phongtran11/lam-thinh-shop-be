export const REFRESH_TOKEN_REVOKE_REASON = {
  MANUAL_REVOKE: 'Manual Revoke',
  USER_LOGOUT: 'User Logout',
  USER_NOT_FOUND: 'User Not Found',
  TOKEN_REFRESH: 'Token Refresh',
  ADMIN_REVOKE: 'Admin Revoke',
  EXPIRED: 'Expired',
} as const;

export type ERefreshTokenRevokeReason =
  (typeof REFRESH_TOKEN_REVOKE_REASON)[keyof typeof REFRESH_TOKEN_REVOKE_REASON];
