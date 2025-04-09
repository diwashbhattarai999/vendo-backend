import { Router } from 'express';

import {
  changePasswordHandler,
  deleteUserHandler,
  getUserHandler,
  removeProfilePictureHandler,
  updateUserHandler,
  uploadProfilePictureHandler,
} from '@/controllers/user.controller';

import { createUploadMiddleware } from '@/middlewares/multer';
import { validateSchema } from '@/middlewares/schema.validation';

import { changePasswordSchema, updateUserSchema } from '@/schema/user.schema';

const multerUpload = createUploadMiddleware().single('profilePicture');

/**
 * User router for handling user-related routes.
 *
 * This router manages endpoints related to user operations, including retrieving user information,
 * updating user details, and deleting a user account.
 */
const userRouter = Router();

/**
 * GET /user
 * @description Endpoint to retrieve user information for the authenticated user.
 */
userRouter.get('/', getUserHandler);

/**
 * PUT /user
 * @description Endpoint to update user information for the authenticated user.
 */
userRouter.put('/', validateSchema(updateUserSchema), updateUserHandler);

/**
 * DELETE /user
 * @description Endpoint to delete the authenticated user's account.
 */
userRouter.delete('/', deleteUserHandler);

/**
 * PUT /user/change-password
 * @description Endpoint to change the password of the authenticated user.
 */
userRouter.put('/change-password', validateSchema(changePasswordSchema), changePasswordHandler);

/**
 * PUT /user/profile-picture/upload
 * @description Endpoint to upload a profile picture for the authenticated user.
 */
userRouter.put('/profile-picture/upload', multerUpload, uploadProfilePictureHandler);

/**
 * PUT /user/profile-picture/remove
 * @description Endpoint to remove the profile picture of the authenticated user.
 */
userRouter.put('/profile-picture/remove', removeProfilePictureHandler);

export { userRouter };
