import { type Request } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';
import { CustomError } from '@/error/custom.api.error';

import { compareValue, hashValue } from '@/utils/bcrypt';
import { sanitizeUser } from '@/utils/sanitize.data';
import { sendHttpResponse } from '@/utils/send.http.response';
import { uploadToCloudinary } from '@/utils/upload.to.cloudinary';

import { logoutService } from '@/services/auth/logout.service';
import { deleteAllSessionsByUserId } from '@/services/db/session.service';
import { deleteUser, updateUser } from '@/services/db/user.service';

import { getAuthenticatedUser } from '@/middlewares/get.authenticated.user';

import type { ChangePasswordType, UpdateUserType } from '@/schema/user.schema';

/**
 * User API Controller
 * Handles user-related operations such as retrieving user information,
 */
export const getUserHandler = asyncCatch(async (req: Request, res) => {
  const t = req.t;

  // Get the authenticated user from the request
  const user = await getAuthenticatedUser(req);

  // Sanitize the user object to exclude sensitive information
  const sanitizedUser = sanitizeUser(user);

  // Send the response with the user information
  sendHttpResponse(res, STATUS_CODES.OK, t('user.success'), sanitizedUser);
});

/**
 * Update User API Controller
 * Handles user information updates by validating the request body,
 * calling the update user service, and sending a response.
 */
export const updateUserHandler = asyncCatch(async (req: Request<{}, {}, UpdateUserType['body']>, res) => {
  const t = req.t;

  // Get the authenticated user from the request
  const user = await getAuthenticatedUser(req);

  // Call the update user service to update user information
  const updatedUser = await updateUser(user.id, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  // Sanitize the updated user object to exclude sensitive information
  const sanitizedUser = sanitizeUser(updatedUser);

  // Send the response with the updated user information
  sendHttpResponse(res, STATUS_CODES.OK, t('user.update_success'), sanitizedUser);
});

/**
 * Delete User API Controller
 * Handles user account deletion by validating the request body,
 * calling the delete user service, and sending a response.
 */
export const deleteUserHandler = asyncCatch(async (req: Request, res) => {
  const t = req.t;

  // Get the authenticated user from the request
  const user = await getAuthenticatedUser(req);

  // Call the delete user service to delete the user account
  await deleteUser(user.id);

  // Send a success response indicating that the user account was deleted
  sendHttpResponse(res, STATUS_CODES.OK, t('user.delete_success'));
});

/**
 * Change Password API Controller
 * Handles password change requests by validating the request body,
 * calling the change password service, and sending a response.
 */
export const changePasswordHandler = asyncCatch(async (req: Request<{}, {}, ChangePasswordType['body']>, res) => {
  const t = req.t;

  // Get the authenticated user from the request
  const user = await getAuthenticatedUser(req);

  // Check if the old password matches the current password
  const isOldPasswordValid = await compareValue(req.body.oldPassword, user.password!);
  if (!isOldPasswordValid) throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_INVALID_CREDENTIALS, t('user.invalid_old_password'));

  // Check if the new password is the same as the old password
  const isNewPasswordSame = await compareValue(req.body.newPassword, user.password!);
  if (isNewPasswordSame) throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.AUTH_SAME_PASSWORD, t('user.same_password'));

  // Hash the new password
  const hashedNewPassword = await hashValue(req.body.newPassword);

  // Call the change password service to update the user's password
  await updateUser(user.id, { password: hashedNewPassword });

  // Call the logout service to delete the user's session
  await logoutService(req, res);

  // Send a success response indicating that the password was changed
  sendHttpResponse(res, STATUS_CODES.OK, t('user.change_password_success'));
});

/**
 * Upload Profile Picture API Controller
 * Handles profile picture upload requests by validating the request body,
 * calling the upload profile picture service, and sending a response.
 */
export const uploadProfilePictureHandler = asyncCatch(async (req: Request, res) => {
  const t = req.t;

  // Check if the file is present in the request
  if (!req.file) throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.INVALID_FILE, t('user.invalid_file'));

  // Get the authenticated user from the request
  const user = await getAuthenticatedUser(req);

  // Upload the file to Cloudinary
  const fileUrl = await uploadToCloudinary(req.file.buffer, {
    folder: 'profile_pictures',
    transformation: [{ width: 200, height: 200, crop: 'fill' }, { quality: 'auto' }, { fetch_format: 'auto' }, { gravity: 'face' }],
  });

  const updatedUser = await updateUser(user.id, { profilePictureUrl: fileUrl });

  // Sanitize the updated user object to exclude sensitive information
  const sanitizedUser = sanitizeUser(updatedUser);

  // Send the response with the updated user information
  sendHttpResponse(res, STATUS_CODES.OK, t('user.upload_profile_picture_success'), sanitizedUser);
});

/**
 * Remove Profile Picture API Controller
 * Handles profile picture removal requests by calling the remove profile picture service,
 * and sending a response.
 */
export const removeProfilePictureHandler = asyncCatch(async (req: Request, res) => {
  const t = req.t;

  // Get the authenticated user from the request
  const user = await getAuthenticatedUser(req);

  // Call the update user service to remove the profile picture URL
  const updatedUser = await updateUser(user.id, { profilePictureUrl: null });

  // Sanitize the updated user object to exclude sensitive information
  const sanitizedUser = sanitizeUser(updatedUser);

  // Send the response with the updated user information
  sendHttpResponse(res, STATUS_CODES.OK, t('user.remove_profile_picture_success'), sanitizedUser);
});

/**
 * Deactivate User API Controller
 * Handles user account deactivation requests by validating the request body,
 * calling the deactivate user service, and sending a response.
 */
export const deactivateUserHandler = asyncCatch(async (req: Request, res) => {
  const t = req.t;

  // Get the authenticated user from the request
  const user = await getAuthenticatedUser(req);

  // Call the update user service to deactivate the user account
  await updateUser(user.id, { isActive: false });

  // If logoutAllSessions is true, call the logout service to delete all sessions
  await deleteAllSessionsByUserId(user.id);

  // Send a success response indicating that the user account was deactivated
  sendHttpResponse(res, STATUS_CODES.OK, t('user.deactivate_success'));
});
