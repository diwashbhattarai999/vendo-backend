import { Router } from 'express';

import { authRouter } from './auth.routes';
import { mfaRouter } from './mfa.routes';
import { sessionRouter } from './sessions.routes';
import { userRouter } from './user.routes';

import { authenticateJWT } from '@/strategies/jwt.strategy';

/**
 * Main router for version 0 of the API.
 *
 * This router aggregates all sub-routers for version 0 of the API.
 * New routers can be added here as the project grows.
 *
 * @returns {Router} Configured Express router for version 0 of the API.
 */
const router = Router();

router.use('/auth', authRouter);
router.use('/sessions', sessionRouter);
router.use('/mfa', mfaRouter);
router.use('/user', authenticateJWT, userRouter);

export { router };
