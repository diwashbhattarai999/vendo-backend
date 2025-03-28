import type { Request, Response } from 'express';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';
import { CustomError } from '@/error/custom.api.error';

import { sendHttpResponse } from '@/utils/send.http.response';

import packageJson from '@/../package.json';

const appName = packageJson.name;
const appEnvironment = env.app.NODE_ENV;
const appVersion = packageJson.version;

/**
 * Root handler that sends basic information about the application.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @throws {CustomError} Throws an error if required environment variables are missing.
 * @returns {void} Sends a response with application info.
 */
export const rootRouteHandler = asyncCatch(async (req: Request, res: Response) => {
  const t = req.t;

  // Check if the required variables from package.json and .env are available.
  if (!appName || !appVersion || !appEnvironment) {
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.INVALID_JSON_CONFIG, t('invalidJsonConfig', { ns: 'error' }));
  }

  // Send a welcome message with the app name, version, and environment.
  sendHttpResponse(res, STATUS_CODES.OK, t('welcomeMessage'), {
    appName,
    appVersion,
    appEnvironment,
  });
});
