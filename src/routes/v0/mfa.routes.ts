import { Router } from 'express';

import { generateMFAHandler, revokeMFAHandler, verifyMFAForLoginHandler, verifyMFASetupHandler } from '@/controllers/mfa.controller';

import { isAuthenticated } from '@/middlewares/is.authenticated';
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
 * Middleware to authenticate JWT and check if the user is authenticated.
 * This middleware is applied to all routes in this router.
 * It ensures that the user is authenticated before accessing any MFA-related endpoints.
 */
mfaRouter.use(authenticateJWT, isAuthenticated);

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
