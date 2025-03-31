import type { Request, RequestHandler } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';
import { CustomError } from '@/error/custom.api.error';

import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthenticationCookies } from '@/utils/cookie';
import { sendHttpResponse } from '@/utils/send.http.response';

import { forgotPasswordService } from '@/services/auth/forgot.password.service';
import { loginService } from '@/services/auth/login.service';
import { refreshTokenService } from '@/services/auth/refresh.token.service';
import { registerService } from '@/services/auth/register.service';
import { verifyEmailService } from '@/services/auth/verify.email.service';

import type { LoginType } from '@/schema/auth/login.schema';
import type { RegisterType } from '@/schema/auth/register.schema';

/**
 * Register API Controller
 * Handles user registration by validating the request body,
 * calling the register service, and sending a response.
 */
export const registerHandler = asyncCatch(async (req: Request<{}, {}, RegisterType['body']>, res, _next) => {
  const t = req.t;

  // Call the register service to create a new user
  const newUser = await registerService(t, { ...req.body });

  // Send a success response with the new user's information
  sendHttpResponse(res, STATUS_CODES.CREATED, t('register.success', { ns: 'auth' }), newUser);
});

/**
 * Login API Controller
 * Handles user login by validating the request body,
 * calling the login service, and sending a response.
 */
export const loginHandler: RequestHandler = asyncCatch(async (req: Request<{}, {}, LoginType['body']>, res, _next) => {
  const t = req.t;
  const userAgent = req.headers['user-agent'];

  // Call the login service to authenticate the user
  const { user, accessToken, refreshToken, mfaRequired } = await loginService(t, { ...req.body, userAgent });

  // Set authentication cookies
  setAuthenticationCookies({ res, accessToken, refreshToken });

  // Send a success response with the user's information and tokens
  sendHttpResponse(res, STATUS_CODES.OK, t('login.success', { ns: 'auth' }), { user, mfaRequired });
});

/**
 * Refresh API Controller
 * Handles token refresh by extracting the refresh token from cookies,
 * calling the refresh token service, and sending a new access token.
 */
export const refreshTokenHandler: RequestHandler = asyncCatch(async (req, res, _next) => {
  const t = req.t;

  // Extract the refresh token from the request cookies
  const refreshToken = req.cookies.refreshToken as string | undefined;

  // Check if the refresh token is provided
  if (!refreshToken)
    throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_REFRESH_TOKEN_NOT_PROVIDED, t('refresh_token.not_provided', { ns: 'auth' }));

  // Call the refresh token service to get new tokens
  const { accessToken, newRefreshToken } = await refreshTokenService(t, refreshToken);

  // Set new authentication cookies
  if (newRefreshToken) res.cookie('refreshToken', newRefreshToken, getRefreshTokenCookieOptions());
  res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());

  // Send a success response with the new access token
  sendHttpResponse(res, STATUS_CODES.OK, t('refresh_token.success', { ns: 'auth' }));
});

/**
 * Verify Email API Controller
 * Handles email verification by validating the request body,
 * calling the verify email service, and sending a response.
 */
export const verifyEmailHandler: RequestHandler = asyncCatch(async (req, res, _next) => {
  const t = req.t;

  // Call the verify email service to verify the user's email
  await verifyEmailService(t, req.body.code);

  // Send a success response indicating that the email verification was successful
  sendHttpResponse(res, STATUS_CODES.OK, t('verify_email.success', { ns: 'auth' }));
});

// Forgot Password API Controller
export const forgotPasswordHandler: RequestHandler = asyncCatch(async (req, res, _next) => {
  const t = req.t;

  // Call the forgot password service to send a password reset email
  const forgotPasswordResposne = await forgotPasswordService(t, req.body.email);

  // Send a success response indicating that the password reset email was sent
  sendHttpResponse(res, STATUS_CODES.OK, t('forgot_password.success', { ns: 'auth' }), forgotPasswordResposne);
});

// Reset Password API Controller
export const resetPasswordHandler: RequestHandler = asyncCatch(async (_req, res, _next) => {
  res.send('Reset Password API Route');
});

// Logout API Controller
export const logoutHandler: RequestHandler = asyncCatch(async (_req, res, _next) => {
  res.send('Logout API Route');
});

// Sessions API Controller
export const sessionsHandler: RequestHandler = asyncCatch(async (_req, res, _next) => {
  res.send('Sessions API Route');
});

// 2FA API Controller
export const twoFactorAuthHandler: RequestHandler = asyncCatch(async (_req, res, _next) => {
  res.send('2FA API Route');
});
