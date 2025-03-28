export const ERROR_CODES = {
  TOO_MANY_REQUESTS: 'E000',
  GENERAL_ERROR: 'E001',
  INVALID_JSON_CONFIG: 'E002',
  ROUTE_NOT_FOUND: 'E003',
  UNAUTHORIZED: 'E004',
  NOT_FOUND: 'E005',
  PAYMENT_REQUIRED: 'E006',
  FORBIDDEN: 'E007',
  METHOD_NOT_ALLOWED: 'E008',
  CONFLICT: 'E009',
  INTERNAL_SERVER_ERROR: 'E010',
} as const;

export type TErrorCodes = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
