import type { Request, RequestHandler } from 'express';

import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';

import { setAuthenticationCookies } from '@/utils/cookie';
import { sendHttpResponse } from '@/utils/send.http.response';

import { loginService } from '@/services/auth/login.service';
import { registerService } from '@/services/auth/register.service';

import type { LoginType } from '@/schema/auth/login.schema';
import type { RegisterType } from '@/schema/auth/register.schema';

/**
 * This function handles the signup process for new users. It expects a request object with the following properties:
 * - email: The user's email address.
 * - password: The user's password.
 * - firstName: The user's first name.
 * - lastName: The user's last name.
 */
export const registerHandler = asyncCatch(async (req: Request<{}, {}, RegisterType['body']>, res, _next) => {
  const t = req.t;

  // Call the register service to create a new user
  const newUser = await registerService({ ...req.body });

  // Send a success response with the new user's information
  sendHttpResponse(res, STATUS_CODES.CREATED, t('auth.register.success'), newUser);
});

// Login API Controller
export const loginHandler: RequestHandler = asyncCatch(async (req: Request<{}, {}, LoginType['body']>, res, _next) => {
  const t = req.t;
  const userAgent = req.headers['user-agent'];

  // Call the login service to authenticate the user
  const { user, accessToken, refreshToken, mfaRequired } = await loginService({ ...req.body, userAgent });

  // Set authentication cookies
  setAuthenticationCookies({ res, accessToken, refreshToken });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- We need to remove the password from the response
  const { password, ...userWithoutPassword } = user;

  // Send a success response with the user's information and tokens
  sendHttpResponse(res, STATUS_CODES.OK, t('auth.login.success'), {
    user: userWithoutPassword,
    mfaRequired,
  });
});

// Refresh API Controller
export const refreshHandler: RequestHandler = asyncCatch(async (_req, res, _next) => {
  res.send('Refresh API Route');
});

// Verify Email API Controller
export const verifyEmailHandler: RequestHandler = asyncCatch(async (_req, res, _next) => {
  res.send('Verify Email API Route');
});

// Forgot Password API Controller
export const forgotPasswordHandler: RequestHandler = asyncCatch(async (_req, res, _next) => {
  res.send('Forgot Password API Route');
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
