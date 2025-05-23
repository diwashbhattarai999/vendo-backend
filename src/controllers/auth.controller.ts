import type { Request } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';
import { CustomError } from '@/error/custom.api.error';

import { getDashboardUrl } from '@/utils/client.urls';
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthenticationCookies } from '@/utils/cookie';
import { sendHttpResponse } from '@/utils/send.http.response';

import { forgotPasswordService } from '@/services/auth/forgot.password.service';
import { loginService } from '@/services/auth/login.service';
import { logoutService } from '@/services/auth/logout.service';
import { refreshTokenService } from '@/services/auth/refresh.token.service';
import { registerService } from '@/services/auth/register.service';
import { resendEmailVerificationService } from '@/services/auth/resend.email.verification.service';
import { resetPasswordService } from '@/services/auth/reset.password.service';
import { verifyEmailService } from '@/services/auth/verify.email.service';

import type { LoginType } from '@/schema/auth/login.schema';
import type { ForgotPasswordType, ResetPasswordType } from '@/schema/auth/password.schema';
import type { RegisterType } from '@/schema/auth/register.schema';
import type { VerifyEmailType } from '@/schema/auth/verify.email.schema';

import { logger } from '@/logger/winston.logger';

/**
 * Register API Controller
 * Handles user registration by validating the request body,
 * calling the register service, and sending a response.
 */
export const registerHandler = asyncCatch(async (req: Request<{}, {}, RegisterType['body']>, res) => {
  const t = req.t;
  const language = req.acceptsLanguages('en', 'ne') || 'en';

  // Call the register service to create a new user
  const newUser = await registerService(t, { ...req.body }, language);

  // Send a success response with the new user's information
  sendHttpResponse(res, STATUS_CODES.CREATED, t('register.success', { ns: 'auth' }), newUser);
});

/**
 * Login API Controller
 * Handles user login by validating the request body,
 * calling the login service, and sending a response.
 */
export const loginHandler = asyncCatch(async (req: Request<{}, {}, LoginType['body']>, res) => {
  const t = req.t;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.ip;
  const language = req.acceptsLanguages('en', 'ne') || 'en';

  // Call the login service to authenticate the user
  const { user, accessToken, refreshToken, mfaRequired, emailVerificationRequired } = await loginService(
    t,
    {
      ...req.body,
      userAgent,
      ipAddress: ipAddress || '',
    },
    language,
  );

  // If Email verification is required, send a response indicating that
  if (emailVerificationRequired) {
    sendHttpResponse(res, STATUS_CODES.OK, t('email_verification_sent', { ns: 'auth' }), { emailVerificationRequired });
    return;
  }

  // If MFA is required, send a response indicating that MFA is required
  if (mfaRequired) {
    sendHttpResponse(res, STATUS_CODES.OK, t('mfa.required', { ns: 'auth' }), { mfaRequired });
    return;
  }

  // Set authentication cookies
  setAuthenticationCookies({ res, accessToken, refreshToken });

  // Send a success response with the user's information and tokensdiwashb999
  sendHttpResponse(res, STATUS_CODES.OK, t('login.success', { ns: 'auth' }), { user, mfaRequired });
});

/**
 * Refresh API Controller
 * Handles token refresh by extracting the refresh token from cookies,
 * calling the refresh token service, and sending a new access token.
 */
export const refreshTokenHandler = asyncCatch(async (req, res) => {
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
export const verifyEmailHandler = asyncCatch(async (req: Request<{}, {}, VerifyEmailType['body']>, res) => {
  const t = req.t;

  // Call the verify email service to verify the user's email
  await verifyEmailService(t, req.body.verificationToken);

  // Send a success response indicating that the email verification was successful
  sendHttpResponse(res, STATUS_CODES.OK, t('verify_email.success', { ns: 'auth' }));
});

/**
 * Resend Email Verification API Controller
 * Handles email verification resend requests by validating the request body,
 * calling the resend email verification service, and sending a response.
 */
export const resendEmailVerificationHandler = asyncCatch(async (req: Request, res) => {
  const t = req.t;
  const { email } = req.body;
  const language = req.acceptsLanguages('en', 'ne') || 'en';

  // Call the resend email verification service to send a new verification email
  await resendEmailVerificationService(t, email, language);

  // Send a success response indicating that the email verification was resent
  sendHttpResponse(res, STATUS_CODES.OK, t('resend_email_verification.success', { ns: 'auth' }));
});

/**
 * Forgot Password API Controller
 * Handles password reset requests by validating the request body,
 * calling the forgot password service, and sending a response.
 */
export const forgotPasswordHandler = asyncCatch(async (req: Request<{}, {}, ForgotPasswordType['body']>, res) => {
  const t = req.t;
  const language = req.acceptsLanguages('en', 'ne') || 'en';

  // Call the forgot password service to send a password reset email
  await forgotPasswordService(t, req.body.email, language);

  // Send a success response indicating that the password reset email was sent
  sendHttpResponse(res, STATUS_CODES.OK, t('forgot_password.success', { ns: 'auth' }));
});

/**
 * Reset Password API Controller
 * Handles password reset by validating the request body,
 * calling the reset password service, and sending a response.
 */
export const resetPasswordHandler = asyncCatch(async (req: Request<{}, {}, ResetPasswordType['body']>, res) => {
  const t = req.t;

  // Call the reset password service to reset the user's password
  const { user } = await resetPasswordService(t, { ...req.body });

  // Send a success response indicating that the password was reset successfully
  sendHttpResponse(res, STATUS_CODES.OK, t('reset_password.success', { ns: 'auth' }), { user });
});

/**
 * Logout API Controller
 * Handles user logout by extracting the session ID from the request,
 * calling the logout service, and sending a response.
 */
export const logoutHandler = asyncCatch(async (req: Request, res) => {
  const t = req.t;

  // Call the logout service to delete the user's session
  await logoutService(req, res);

  // Send a success response indicating that the user has logged out
  sendHttpResponse(res, STATUS_CODES.OK, t('logout.success', { ns: 'auth' }));
});

/**
 * Google Authentication API Controller
 * Handles Google authentication by redirecting the user to the Google login page.
 */
export const oauthRedirectHandler = asyncCatch(async (req: Request, res) => {
  const language = req.acceptsLanguages('en', 'ne') || 'en';

  logger.info('Redirecting to the client dashboard after successful OAuth login');

  // Successful authentication, redirect home.
  const dashboardUrl = getDashboardUrl(language);
  return res.redirect(dashboardUrl);
});
