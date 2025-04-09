import { Router } from 'express';

import { activateUserAccountHandler } from '@/controllers/admin/admin.user.controller';

const adminRouter = Router();

/**
 * PUT /activate/:userId
 * @description Endpoint to check if the user is an admin.
 */
adminRouter.put('/activate/:userId', activateUserAccountHandler);

export { adminRouter };
