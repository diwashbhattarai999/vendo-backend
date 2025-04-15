import { Router } from 'express';

import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  oauthRedirectHandler,
  refreshTokenHandler,
  registerHandler,
  resendEmailVerificationHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from '@/controllers/auth.controller';

import { validateSchema } from '@/middlewares/schema.validation';

import { loginSchema } from '@/schema/auth/login.schema';
import { forgotPasswordSchema, resetPasswordSchema } from '@/schema/auth/password.schema';
import { registerSchema } from '@/schema/auth/register.schema';
import { resendEmailVerificationSchema } from '@/schema/auth/resend.email.verification';
import { verifyEmailSchema } from '@/schema/auth/verify.email.schema';

import { facebookAuthMiddleware } from '@/strategies/facebook.strategy';
import { googleAuthMiddleware } from '@/strategies/google.strategy';
import { authenticateJWT } from '@/strategies/jwt.strategy';

/**
 * Authentication router for handling authentication-related routes.
 *
 * This router manages endpoints related to user registration, login, password management,
 * email verification, and session management.
 */
const authRouter = Router();

/**
 * POST /register
 * @description Endpoint for user registration.
 */
authRouter.post('/register', validateSchema(registerSchema), registerHandler);

/**
 * POST /login
 * @description Endpoint for user login.
 */
authRouter.post('/login', validateSchema(loginSchema), loginHandler);

/**
 * POST /refresh
 * @description Endpoint to refresh the access token.
 */
authRouter.get('/refresh', refreshTokenHandler);

/**
 * POST /verify/email
 * @description Endpoint to verify user email.
 */
authRouter.post('/verify/email', validateSchema(verifyEmailSchema), verifyEmailHandler);

/**
 * POST /resend/verification
 * @description Endpoint to resend email verification.
 */
authRouter.post('/resend/verification', validateSchema(resendEmailVerificationSchema), resendEmailVerificationHandler);

/**
 * POST /password/forgot
 * @description Endpoint to initiate password reset process.
 */
authRouter.post('/password/forgot', validateSchema(forgotPasswordSchema), forgotPasswordHandler);

/**
 * POST /password/reset
 * @description Endpoint to reset user password.
 */
authRouter.post('/password/reset', validateSchema(resetPasswordSchema), resetPasswordHandler);

/**
 * POST /logout
 * @description Endpoint to log out the user.
 */
authRouter.post('/logout', authenticateJWT, logoutHandler);

/**
 * GET /google
 * @description Endpoint to initiate Google authentication.
 */
authRouter.get('/google', googleAuthMiddleware);

/**
 * GET /google/callback
 * @description Callback endpoint for Google authentication.
 */
authRouter.get('/google/callback', googleAuthMiddleware, oauthRedirectHandler);

/**
 * GET /facebook
 * @description Endpoint to initiate Facebook authentication.
 */
authRouter.get('/facebook', facebookAuthMiddleware);

/**
 * GET /facebook/callback
 * @description Callback endpoint for Facebook authentication.
 */
authRouter.get('/facebook/callback', facebookAuthMiddleware, oauthRedirectHandler);

export { authRouter };
