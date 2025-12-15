import { REFRESH_TOKEN_REVOKE_REASON } from '../constants/refresh-token.dto';

export type RefreshTokenRevokeReason =
  (typeof REFRESH_TOKEN_REVOKE_REASON)[keyof typeof REFRESH_TOKEN_REVOKE_REASON];
