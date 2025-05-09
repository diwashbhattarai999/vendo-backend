import { Router } from 'express';

import { deleteSessionHandler, getAllSessionsHandler, getSessionHandler } from '@/controllers/session.controller';

import { validateSchema } from '@/middlewares/schema.validation';

import { deleteSessionSchema } from '@/schema/auth/session.schema';

/**
 * Session router for handling session-related routes.
 *
 * This router manages endpoints related to user sessions, including retrieving all sessions,
 * getting the current session, and deleting a specific session.
 */
const sessionRouter = Router();

/**
 * GET /sessions/all
 * @description Endpoint to retrieve all sessions for the authenticated user.
 */
sessionRouter.get('/all', getAllSessionsHandler);

/**
 * GET /sessions/current
 * @description Endpoint to retrieve the current session for the authenticated user.
 */
sessionRouter.get('/current', getSessionHandler);

/**
 * DELETE /sessions/delete/:sessionId
 * @description Endpoint to delete a specific session for the authenticated user.
 */
sessionRouter.delete('/delete/:sessionId', validateSchema(deleteSessionSchema), deleteSessionHandler);

export { sessionRouter };
