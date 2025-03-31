import { Router } from 'express';

import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
  registerHandler,
  resetPasswordHandler,
  sessionsHandler,
  twoFactorAuthHandler,
  verifyEmailHandler,
} from '@/controllers/auth.controller';

import { validateSchema } from '@/middlewares/schema.validation';

import { loginSchema } from '@/schema/auth/login.schema';
import { forgotPasswordSchema, resetPasswordSchema } from '@/schema/auth/password.schema';
import { registerSchema } from '@/schema/auth/register.schema';
import { verifyEmailSchema } from '@/schema/auth/verify.email.schema';

const authRouter = Router();

authRouter.post('/register', validateSchema(registerSchema), registerHandler);
authRouter.post('/login', validateSchema(loginSchema), loginHandler);

authRouter.get('/refresh', refreshTokenHandler);

authRouter.post('/verify/email', validateSchema(verifyEmailSchema), verifyEmailHandler);

authRouter.post('/password/forgot', validateSchema(forgotPasswordSchema), forgotPasswordHandler);
authRouter.post('/password/reset', validateSchema(resetPasswordSchema), resetPasswordHandler);

authRouter.post('/logout', logoutHandler);

authRouter.get('/sessions', sessionsHandler);

authRouter.post('/2fa', twoFactorAuthHandler);

export { authRouter };
