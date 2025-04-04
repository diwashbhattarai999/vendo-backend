import { Router } from 'express';

import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
  registerHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from '@/controllers/auth.controller';

import { validateSchema } from '@/middlewares/schema.validation';

import { loginSchema } from '@/schema/auth/login.schema';
import { forgotPasswordSchema, resetPasswordSchema } from '@/schema/auth/password.schema';
import { registerSchema } from '@/schema/auth/register.schema';
import { verifyEmailSchema } from '@/schema/auth/verify.email.schema';

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

export { authRouter };
