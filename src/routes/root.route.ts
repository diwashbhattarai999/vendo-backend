import { Router } from 'express';

import { getHealthHandler, metricsHandler, rootRouteHandler } from '@/controllers/root.controller';

import { validateSchema } from '@/middlewares/schema.validation';

import { metricsSchema } from '@/schema/metrics.schema';

/**
 * Root router for the application.
 *
 * This router handles the root endpoint (`/`) and routes related to the basic information of the application.
 */
const rootRouter = Router();

/**
 * Root endpoint.
 *
 * This is the entry point of the application, typically used to provide basic status or welcome information.
 */
rootRouter.get('/', rootRouteHandler); // Handles GET requests to the root endpoint

/**
 * GET /health
 * @description Endpoint to check the health of the application.
 */
rootRouter.get('/health', getHealthHandler);

/**
 * GET /metrics
 * @description Endpoint to retrieve application performance metrics.
 */
rootRouter.get('/metrics', validateSchema(metricsSchema), metricsHandler);

export { rootRouter };
