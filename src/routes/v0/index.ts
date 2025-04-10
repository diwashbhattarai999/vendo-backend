import { Router } from 'express';
import { UserRole } from '@prisma/client';

import { checkActiveUser } from '@/middlewares/check.active.user';
import { checkRole } from '@/middlewares/check.user.role';

import { adminRouter } from './admin.routes';
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
router.use('/sessions', authenticateJWT, checkActiveUser, sessionRouter);
router.use('/mfa', mfaRouter);
router.use('/user', authenticateJWT, checkActiveUser, userRouter);
router.use('/admin', authenticateJWT, checkActiveUser, checkRole([UserRole.ADMIN]), adminRouter);

export { router };
