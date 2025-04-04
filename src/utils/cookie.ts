import type { CookieOptions, Response } from 'express';

import { env } from '@/config/env';

import { calculateExpirationDate } from './date.time';
import { isProduction } from './env.utils';

/**
 * Cookie options for authentication.
 * This object contains default settings for cookies used in authentication.
 * It includes properties like httpOnly, secure, and sameSite.
 * These options are used to enhance security and control how cookies are handled by the browser.
 * - The `secure` option is set to true in production to ensure cookies are only sent over HTTPS.
 * - The `sameSite` option is set to 'strict' in production to prevent CSRF attacks.
 * - The `httpOnly` option is set to true to prevent client-side JavaScript from accessing the cookies.
 */
const defaults: CookieOptions = {
  httpOnly: true,
  secure: isProduction ? true : false,
  sameSite: isProduction ? 'strict' : 'lax',
};

/**
 * Cookie options for access token.
 * This function calculates the expiration date based on the environment variables.
 * It uses the `calculateExpirationDate` function to determine the expiration date
 */
export const getAccessTokenCookieOptions = (): CookieOptions => {
  const expiresIn = env.jwt.ACCESS_TOKEN_EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);
  return {
    ...defaults,
    expires,
    path: '/',
  };
};

/**
 * The path for the refresh token cookie.
 * This is used to set the path for the refresh token cookie.
 */
export const REFRESH_PATH = `${env.app.BASE_URL}/auth/refresh`;

/**
 * Cookie options for the refresh token.
 * This function calculates the expiration date based on the environment variables.
 * It uses the `calculateExpirationDate` function to determine the expiration date
 */
export const getRefreshTokenCookieOptions = (): CookieOptions => {
  const expiresIn = env.jwt.REFRESH_TOKEN_EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);
  return {
    ...defaults,
    expires,
    path: REFRESH_PATH,
  };
};

/**
 * Payload type for setting authentication cookies.
 * This type defines the structure of the payload used to set authentication cookies.
 */
type CookiePayloadType = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

/**
 * Sets authentication cookies for access and refresh tokens.
 * This function takes a response object and the access and refresh tokens,
 * and sets them as cookies in the response.
 *
 * @param {Response} res - The response object from Express.
 * @returns {Response} - The response object with the cookies set.
 */
export const setAuthenticationCookies = ({ res, accessToken, refreshToken }: CookiePayloadType): Response =>
  res.cookie('accessToken', accessToken, getAccessTokenCookieOptions()).cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

/**
 * Clears authentication cookies for access and refresh tokens.
 * This function takes a response object and clears the access and refresh token cookies.
 *
 * @param {Response} res - The response object from Express.
 * @returns {Response} - The response object with the cookies cleared.
 */
export const clearAuthenticationCookies = (res: Response): Response =>
  res.clearCookie('accessToken').clearCookie('refreshToken', {
    path: REFRESH_PATH,
  });
