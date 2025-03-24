import { Router } from 'express';

import { getHealthHandler } from '@/controllers/health.controller';

/**
 * Health check route for the application.
 * This route responds with the current status of the application health.
 *
 * @module healthRouter
 */
const healthRouter = Router();

/**
 * GET /health
 * @description Endpoint to check the health of the application.
 * @route GET /health
 * @returns {Object} 200 - The application health status.
 */
healthRouter.get('/', getHealthHandler);

export { healthRouter };
