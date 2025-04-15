/**
 * Error codes for the application.
 * These codes are used to identify specific error conditions
 * and provide meaningful messages to the user.
 * They are also used for logging and debugging purposes.
 */
export enum ERROR_CODES {
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  GENERAL_ERROR = 'GENERAL_ERROR',
  INVALID_JSON_CONFIG = 'INVALID_JSON_CONFIG',
  ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
  FORBIDDEN = 'FORBIDDEN',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',

  AUTH_EMAIL_ALREADY_EXISTS = 'AUTH_EMAIL_ALREADY_EXISTS',
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_NOT_FOUND = 'AUTH_TOKEN_NOT_FOUND',
  AUTH_REFRESH_TOKEN_NOT_PROVIDED = 'AUTH_REFRESH_TOKEN_NOT_PROVIDED',
  AUTH_REFRESH_TOKEN_INVALID = 'AUTH_REFRESH_TOKEN_INVALID',
  AUTH_SESSION_NOT_FOUND = 'AUTH_SESSION_NOT_FOUND',
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  AUTH_PASSWORD_SAME = 'AUTH_PASSWORD_SAME',
  AUTH_BLOCKED = 'AUTH_BLOCKED',
  AUTH_EMAIL_ALREADY_REGISTERED_WITH_DIFFERENT_PROVIDER = 'AUTH_EMAIL_ALREADY_REGISTERED_WITH_DIFFERENT_PROVIDER',
  AUTH_ACCOUNT_NOT_FOUND = 'AUTH_ACCOUNT_NOT_FOUND',
  AUTH_INVALID_PROVIDER = 'AUTH_INVALID_PROVIDER',
  AUTH_SAME_PASSWORD = 'AUTH_SAME_PASSWORD',

  EMAIL_SENDING_FAILED = 'EMAIL_SENDING_FAILED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',

  VERIFICATION_CODE_INVALID_OR_EXPIRED = 'VERIFICATION_CODE_INVALID_OR_EXPIRED',
  UNABLE_TO_VERIFY_EMAIL = 'UNABLE_TO_VERIFY_EMAIL',

  USER_NOT_FOUND = 'USER_NOT_FOUND',
  ACCOUNT_DEACTIVATED = 'ACCOUNT_DEACTIVATED',
  USER_ALREADY_ACTIVE = 'USER_ALREADY_ACTIVE',

  MFA_ALREADY_ENABLED = 'MFA_ALREADY_ENABLED',
  MFA_INVALID_CODE = 'MFA_INVALID_CODE',
  MFA_NOT_ENABLED = 'MFA_NOT_ENABLED',

  INVALID_FILE = 'INVALID_FILE',
}

export type TErrorCodes = keyof typeof ERROR_CODES;
