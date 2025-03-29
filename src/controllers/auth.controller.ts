import type { Request, RequestHandler } from 'express';

import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';

import { sendHttpResponse } from '@/utils/send.http.response';

import { registerService } from '@/services/auth/register.service';

import type { RegisterType } from '@/schema/auth/register.schema';

/**
 * This function handles the signup process for new users. It expects a request object with the following properties:
 * - email: The user's email address.
 * - password: The user's password.
 * - firstName: The user's first name.
 * - lastName: The user's last name.
 * - phoneNumber: The user's phone number.
 */
export const registerHandler = asyncCatch(async (req: Request<{}, {}, RegisterType['body']>, res, _next) => {
  const newUser = await registerService({ ...req.body });
  sendHttpResponse(res, STATUS_CODES.CREATED, 'User created successfully', newUser);
});

// Login API Controller
export const loginHandler: RequestHandler = asyncCatch(async (_req, res, _next) => {
  res.send('Login API Route');
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
