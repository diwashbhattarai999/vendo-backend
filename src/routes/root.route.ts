import { Router } from 'express';

import { rootRouteHandler } from '@/controllers/root.controller';

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

export { rootRouter };
