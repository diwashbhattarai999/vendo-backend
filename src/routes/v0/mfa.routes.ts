import { Router } from 'express';

import { generateMFAHandler, revokeMFAHandler, verifyMFAForLoginHandler, verifyMFASetupHandler } from '@/controllers/mfa.controller';

import { checkActiveUser } from '@/middlewares/check.active.user';
import { validateSchema } from '@/middlewares/schema.validation';

import { verifyMfaForLoginSchema, verifyMfaSetupSchema } from '@/schema/auth/mfa.schema';

import { authenticateJWT } from '@/strategies/jwt.strategy';

/**
 * MFA router for handling multi-factor authentication-related routes.
 *
 * This router manages endpoints related to MFA, including generating MFA codes,
 * verifying MFA setup, and revoking MFA.
 */
const mfaRouter = Router();

/**
 * POST /mfa/verify-login
 * @description Endpoint to verify MFA during login.
 */
mfaRouter.post('/verify-login', validateSchema(verifyMfaForLoginSchema), verifyMFAForLoginHandler);

/**
 * Middleware to authenticate JWT and check if the user is active.
 * This middleware is applied to all routes below this point.
 * It ensures that the user is authenticated and has an active account.
 * If the user is not authenticated or their account is inactive, an error will be thrown.
 */
mfaRouter.use(authenticateJWT, checkActiveUser);

/**
 * MFA router for handling multi-factor authentication-related routes.
 *
 * This router manages endpoints related to MFA, including generating MFA codes,
 * verifying MFA setup, and revoking MFA.
 */
mfaRouter.get('/setup', generateMFAHandler);

/**
 * POST /mfa/verify
 * @description Endpoint to verify MFA setup.
 */
mfaRouter.post('/verify', validateSchema(verifyMfaSetupSchema), verifyMFASetupHandler);

/**
 * POST /mfa/revoke
 * @description Endpoint to revoke MFA for the authenticated user.
 */
mfaRouter.put('/revoke', revokeMFAHandler);

export { mfaRouter };
