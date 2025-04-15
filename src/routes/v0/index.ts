import { Router } from 'express';
import { UserRole } from '@prisma/client';

import { checkRole } from '@/middlewares/check.user.role';
import { isAuthenticated } from '@/middlewares/is.authenticated';

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
router.use('/sessions', authenticateJWT, isAuthenticated, sessionRouter);
router.use('/mfa', mfaRouter);
router.use('/user', authenticateJWT, isAuthenticated, userRouter);
router.use('/admin', authenticateJWT, isAuthenticated, checkRole([UserRole.ADMIN]), adminRouter);

export { router };
