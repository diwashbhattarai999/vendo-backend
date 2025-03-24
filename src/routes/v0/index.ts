import { Router } from 'express';

import { exampleRouter } from '@/routes/v0/example.routes';
import { healthRouter } from '@/routes/v0/health.routes';

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

// More routers can be added here for other versioned API endpoints

export { router };
