import type { TFunction } from 'i18next';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { calculateExpirationDate, ONE_DAY_IN_MS } from '@/utils/date.time';
import { refreshTokenSignOptions, type RefreshTPayload, signJwtToken, verifyJwtToken } from '@/utils/jwt';

import prisma from '@/database/prisma-client';

/**
 * Service to handle token refresh.
 * This function verifies the refresh token,
 * checks the session in the database,
 * and generates a new access token.
 *
 * @param {Request} req - The request object.
 * @param {string} refreshToken - The refresh token to verify.
 * @returns {Promise<{ accessToken: string; newRefreshToken?: string }>} - The new access token and optional refresh token.
 */
export const refreshTokenService = async (t: TFunction, refreshToken: string): Promise<{ accessToken: string; newRefreshToken?: string }> => {
  // Verify the refresh token and extract the payload
  const { payload } = verifyJwtToken<RefreshTPayload>(refreshToken, { secret: refreshTokenSignOptions.secret });
  if (!payload) throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_REFRESH_TOKEN_INVALID, t('refresh_token.invalid', { ns: 'auth' }));

  // Check if the session exists in the database
  const session = await prisma.session.findUnique({ where: { id: payload.sessionId } });
  if (!session) throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_SESSION_NOT_FOUND, t('session.does_not_exist', { ns: 'auth' }));

  // Get the current time
  const now = Date.now();

  // Check if the session has expired
  if (session.expiresAt.getTime() <= now)
    throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_SESSION_EXPIRED, t('session.expired', { ns: 'auth' }));

  // Check if the session requires a refresh
  const sessionRequireRefresh = session.expiresAt.getTime() - now <= ONE_DAY_IN_MS;

  // Update the session expiration date if it requires a refresh
  if (sessionRequireRefresh) {
    await prisma.session.update({
      where: { id: payload.sessionId },
      data: { expiresAt: calculateExpirationDate(env.jwt.ACCESS_TOKEN_EXPIRES_IN) },
    });
  }

  // Create a new access token
  const newRefreshToken = sessionRequireRefresh ? signJwtToken({ sessionId: session.id }, refreshTokenSignOptions) : undefined;
  const accessToken = signJwtToken({ userId: session.userId, sessionId: session.id });

  // Return the new tokens and session information
  return { accessToken, newRefreshToken };
};
