import type { CookieOptions, Response } from 'express';

import { env } from '@/config/env';

import { calculateExpirationDate } from './date.time';

const defaults: CookieOptions = {
  httpOnly: true,
  //secure: config.NODE_ENV === "production" ? true : false,
  //sameSite: config.NODE_ENV === "production" ? "strict" : "lax",
};

export const getAccessTokenCookieOptions = (): CookieOptions => {
  const expiresIn = env.jwt.ACCESS_TOKEN_EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);
  return {
    ...defaults,
    expires,
    path: '/',
  };
};

export const REFRESH_PATH = `${env.app.BASE_URL}/auth/refresh`;

export const getRefreshTokenCookieOptions = (): CookieOptions => {
  const expiresIn = env.jwt.REFRESH_TOKEN_EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);
  return {
    ...defaults,
    expires,
    path: REFRESH_PATH,
  };
};

type CookiePayloadType = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthenticationCookies = ({ res, accessToken, refreshToken }: CookiePayloadType): Response =>
  res.cookie('accessToken', accessToken, getAccessTokenCookieOptions()).cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

export const clearAuthenticationCookies = (res: Response): Response =>
  res.clearCookie('accessToken').clearCookie('refreshToken', {
    path: REFRESH_PATH,
  });
