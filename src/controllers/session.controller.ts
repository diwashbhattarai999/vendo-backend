import type { Request } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';
import { CustomError } from '@/error/custom.api.error';

import { sendHttpResponse } from '@/utils/send.http.response';

import { deleteSessionByIdAndUserId, getAllSessionsByUserId, getSessionUserById } from '@/services/db/session.service';

import type { DeleteSessionType } from '@/schema/auth/session.schema';

/**
 * Get All Sessions API Controller
 * Handles the retrieval of all user sessions by calling the session service
 * and sending a response with the session data.
 */
export const getAllSessionsHandler = asyncCatch(async (req: Request, res) => {
  const t = req.t;
  const userId = req.user?.id;
  const sessionId = req.sessionId;

  // Call the get all sessions service to retrieve all user sessions
  const sessions = await getAllSessionsByUserId(userId!);

  const sessionsWithCurrent = sessions.map((session) => ({
    ...session,
    ...(session.id === sessionId && {
      isCurrent: true,
    }),
  }));

  // Send a success response with the retrieved sessions
  sendHttpResponse(res, STATUS_CODES.OK, t('session.get_all.success', { ns: 'auth' }), { sessions: sessionsWithCurrent });
});

/**
 * Get Session API Controller
 * Handles the retrieval of a specific user session by ID.
 * If the session is not found, it throws a custom error.
 */
export const getSessionHandler = asyncCatch(async (req: Request, res) => {
  const t = req.t;
  const sessionId = req?.sessionId;

  if (!sessionId) throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.BAD_REQUEST, t('session.id_not_found', { ns: 'auth' }));

  // Call the get session service to retrieve the session by ID
  const user = await getSessionUserById(sessionId);
  if (!user) throw new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.NOT_FOUND, t('session.not_found', { ns: 'auth' }));

  // Send a success response with the retrieved session
  sendHttpResponse(res, STATUS_CODES.OK, t('session.get.success', { ns: 'auth' }), { user });
});

/**
 * Delete Session API Controller
 * Handles the deletion of a user session by ID.
 * If the session is not found, it throws a custom error.
 */
export const deleteSessionHandler = asyncCatch(async (req: Request<DeleteSessionType['params']>, res) => {
  const t = req.t;
  const { sessionId } = req.params;
  const userId = req.user?.id;

  // Check if the session with the given ID exists
  const session = await getSessionUserById(sessionId);
  if (!session) throw new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.NOT_FOUND, t('session.not_found', { ns: 'auth' }));

  // Call the delete session service to delete the session by ID
  await deleteSessionByIdAndUserId(sessionId, userId!);

  // Send a success response indicating that the session was deleted
  sendHttpResponse(res, STATUS_CODES.OK, t('session.delete.success', { ns: 'auth' }));
});
