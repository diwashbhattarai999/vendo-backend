import type { NextFunction, Request, Response } from 'express';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';
import { CustomError } from '@/error/custom.api.error';

/**
 * Middleware to verify the API key in the request headers
 *
 * @param req - The incoming request object
 * @param _res - The outgoing response object (not used in this function)
 * @param next - The next middleware function to call
 * @throws CustomError - If the API key is missing or invalid
 * @returns Calls the next middleware if the API key is valid
 */
export const verifyApiKey = asyncCatch(async (req: Request, _res: Response, next: NextFunction) => {
  const t = req.t;

  // Skip API key verification in development if configured
  if (env.app.DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT) return next();

  // Get the API key from the request headers
  const apiKey = req.headers['x-api-key'];

  // Ensure apiKey is a string
  const apiKeyString = Array.isArray(apiKey) ? apiKey[0] : apiKey;

  /**
   * Retrieve the valid API key from environment variables
   * API keys should be stored securely, following best practices for sensitive data
   * @see https://blog.stoplight.io/api-keys-best-practices-to-authenticate-apis
   */
  const validApiKey = env.app.API_KEY;

  // If API key is missing in the request, throw an error
  if (!apiKeyString) {
    throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('api_key_not_found_message', { ns: 'error' }));
  }

  // If the provided API key does not match the valid API key, throw an error
  if (apiKeyString !== validApiKey) {
    throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('api_key_not_matched_message', { ns: 'error' }));
  }

  // Attach the valid API key to the request object for later use
  req.apiKey = apiKeyString;

  // Proceed to the next middleware or route handler
  next();
});
