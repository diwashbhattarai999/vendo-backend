import type { Session, User } from '@prisma/client';
import jwt, { type SignOptions, type VerifyOptions } from 'jsonwebtoken';
import type ms from 'ms';

import { env } from '@/config/env';

import { logger } from '@/logger/winston.logger';

/**
 * Payload for access tokens.
 */
export type AccessTPayload = {
  userId: User['id'];
  sessionId: Session['id'];
};

/**
 * Payload for refresh tokens.
 */
export type RefreshTPayload = {
  sessionId: Session['id'];
};

/**
 * Extended options for signing JWT tokens, including the secret key.
 */
type SignOptsAndSecret = SignOptions & {
  secret: string;
};

/**
 * Default options for signing JWT tokens.
 * These options are merged with specific token options when signing tokens.
 */
const defaults: SignOptions = {
  audience: ['user'], // Specifies the intended audience for the token
};

/**
 * Options for signing the access token.
 * This includes the expiration time and the secret key.
 */
export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: env.jwt.ACCESS_TOKEN_EXPIRES_IN as ms.StringValue,
  secret: env.jwt.ACCESS_TOKEN_SECRET,
};

/**
 * Options for signing the refresh token.
 * This includes the expiration time and the secret key.
 */
export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: env.jwt.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue,
  secret: env.jwt.REFRESH_TOKEN_SECRET,
};

/**
 * Signs a JWT token with the given payload and options.
 *
 * @template TPayload - The type of the payload (e.g., `AccessTPayload` or `RefreshTPayload`).
 * @param {TPayload} payload - The payload to include in the token.
 * @param {SignOptsAndSecret} [options] - The options for signing the token. Defaults to `accessTokenSignOptions`.
 * @returns {string} The signed JWT token.
 */
export const signJwtToken = <TPayload extends object>(payload: TPayload, options?: SignOptsAndSecret): string => {
  const { secret, ...opts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });
};

/**
 * Verifies a JWT token and returns the payload if valid.
 *
 * @template TPayload - The expected type of the payload.
 * @param {string} token - The JWT token to verify.
 * @param {VerifyOptions & { secret: string }} [options] - The options for verifying the token. Defaults to `accessTokenSignOptions`.
 * @returns {{ payload?: TPayload; error?: string }} An object containing the payload if valid, or an error message if invalid.
 */
export const verifyJwtToken = <TPayload extends object = AccessTPayload>(
  token: string,
  options?: VerifyOptions & { secret: string },
): { payload?: TPayload; error?: string } => {
  try {
    const { secret = env.jwt.ACCESS_TOKEN_SECRET, ...opts } = options || {};
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...opts,
    }) as TPayload;
    return { payload };
  } catch (err: unknown) {
    logger.error('Error verifying JWT token:', err);
    return { error: err instanceof Error ? err.message : 'An unknown error occurred' };
  }
};
