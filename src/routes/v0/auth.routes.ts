import { Router } from 'express';

import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  sessionsHandler,
  twoFactorAuthHandler,
  verifyEmailHandler,
} from '@/controllers/auth.controller';

import { validateSchema } from '@/middlewares/schema.validation';

import { registerSchema } from '@/schema/auth/register.schema';

const authRouter = Router();

// Register API Route
authRouter.post('/register', validateSchema(registerSchema), registerHandler);

// Login API Route
authRouter.post('/login', loginHandler);

// Refresh API Route
authRouter.post('/refresh', refreshHandler);

// Verify Email API Route
authRouter.post('/verify-email', verifyEmailHandler);

// Forgot Password API Route
authRouter.post('/forgot-password', forgotPasswordHandler);

// Reset Password API Route
authRouter.post('/reset-password', resetPasswordHandler);

// Logout API Route
authRouter.post('/logout', logoutHandler);

// Sessions API Route
authRouter.get('/sessions', sessionsHandler);

// 2FA API Route
authRouter.post('/2fa', twoFactorAuthHandler);

export { authRouter };
