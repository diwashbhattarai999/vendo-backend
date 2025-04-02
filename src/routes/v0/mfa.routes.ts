import { Router } from 'express';

import { generateMFAHandler, revokeMFAHandler, verifyMFAForLoginHandler, verifyMFASetupHandler } from '@/controllers/mfa.controller';

import { validateSchema } from '@/middlewares/schema.validation';

import { verifyMfaForLoginSchema, verifyMfaSetupSchema } from '@/schema/auth/mfa.schema';

import { authenticateJWT } from '@/strategies/jwt.strategy';

const mfaRouter = Router();

mfaRouter.get('/setup', authenticateJWT, generateMFAHandler);
mfaRouter.post('/verify', authenticateJWT, validateSchema(verifyMfaSetupSchema), verifyMFASetupHandler);
mfaRouter.put('/revoke', authenticateJWT, revokeMFAHandler);
mfaRouter.post('/verify-login', validateSchema(verifyMfaForLoginSchema), verifyMFAForLoginHandler);

export { mfaRouter };
