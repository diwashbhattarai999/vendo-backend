import type { Session, User } from '@prisma/client';
import jwt, { type SignOptions, type VerifyOptions } from 'jsonwebtoken';

import { env } from '@/config/env';

import { logger } from '@/logger/winston.logger';

export type AccessTPayload = {
  userId: User['id'];
  sessionId: Session['id'];
};

export type RefreshTPayload = {
  sessionId: Session['id'];
};

type SignOptsAndSecret = SignOptions & {
  secret: string;
};

/**
 * Default options for signing JWT tokens.
 */
const defaults: SignOptions = {
  audience: ['user'],
};

/**
 * Options for signing the access token.
 */
export const accessTokenSignOptions: SignOptsAndSecret = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expiresIn: env.jwt.ACCESS_TOKEN_EXPIRES_IN as any,
  secret: env.jwt.ACCESS_TOKEN_SECRET,
};

/**
 * Options for signing the refresh token.
 */
export const refreshTokenSignOptions: SignOptsAndSecret = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expiresIn: env.jwt.REFRESH_TOKEN_EXPIRES_IN as any,
  secret: env.jwt.REFRESH_TOKEN_SECRET,
};

/**
 * Signs a JWT token with the given payload and options.
 * @param payload - The payload to sign.
 * @param options - The options for signing the token.
 * @returns The signed JWT token.
 */
export const signJwtToken = (payload: AccessTPayload | RefreshTPayload, options?: SignOptsAndSecret) => {
  const { secret, ...opts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });
};

/**
 * Verifies a JWT token and returns the payload if valid.
 */
export const verifyJwtToken = <TPayload extends object = AccessTPayload>(token: string, options?: VerifyOptions & { secret: string }) => {
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
