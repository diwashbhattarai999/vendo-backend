import { Router } from 'express';

import { authRouter } from './auth.routes';

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

// More routers can be added here for other versioned API endpoints

export { router };
