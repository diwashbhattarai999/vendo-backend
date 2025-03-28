import { Router } from 'express';

import { exampleRouter } from '@/routes/v0/example.routes';
import { healthRouter } from '@/routes/v0/health.routes';
import { userRouter } from '@/routes/v0/user.routes';

/**
 * Main router for version 0 of the API.
 *
 * This router aggregates all sub-routers for version 0 of the API.
 * New routers can be added here as the project grows.
 *
 * @returns {Router} Configured Express router for version 0 of the API.
 */
const router = Router();

router.use('/health', healthRouter);
router.use('/example', exampleRouter);
router.use('/user', userRouter);

// More routers can be added here for other versioned API endpoints

export { router };
