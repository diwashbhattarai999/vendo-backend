import { Router } from 'express';

import { deleteSessionHandler, getAllSessionsHandler, getSessionHandler } from '@/controllers/session.controller';

import { validateSchema } from '@/middlewares/schema.validation';

import { deleteSessionSchema } from '@/schema/auth/session.schema';

import { authenticateJWT } from '@/strategies/jwt.strategy';

const sessionRouter = Router();

sessionRouter.get('/all', authenticateJWT, getAllSessionsHandler);
sessionRouter.get('/current', authenticateJWT, getSessionHandler);
sessionRouter.delete('/delete/:sessionId', authenticateJWT, validateSchema(deleteSessionSchema), deleteSessionHandler);

export { sessionRouter };
