import type { Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

/**
 * Hi folks! 👋
 * In this rate-limiter middleware, we are using the `express-rate-limit`
 * for seek of simplicity and costomization.
 *
 * You can go through documentation for yor best suit.
 * @documentation https://express-rate-limit.mintlify.app/overview
 *
 * For Data Store:
 * @documentation https://express-rate-limit.mintlify.app/reference/stores
 */

const WINDOW_IN_MILI_SECONDS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 100;

export const rateLimiter = rateLimit({
  windowMs: WINDOW_IN_MILI_SECONDS,
  max: MAX_REQUESTS_PER_WINDOW,
  standardHeaders: true,
  legacyHeaders: false,

  /**
   *
   * @description: This is a custom skip function.
   * It will skip the rate limiter in by DISABLE_RATE_LIMITER from the env.
   */
  skip: (req, _res) => {
    // skip for metrics and health routes
    if (req.url === '/metrics' || req.url === '/api/v0/health') return true;

    // skip rate limiter if DISABLE_RATE_LIMITER is set
    return env.app.DISABLE_RATE_LIMITER;
  },

  message: (req: Request, _res: Response) => ({
    error: req.t('too_many_requests_message', { ns: 'error' }),
  }),

  handler: (req: Request, _res: Response) => {
    throw new CustomError(STATUS_CODES.TOO_MANY_REQUESTS, ERROR_CODES.TOO_MANY_REQUESTS, req.t('too_many_requests_message', { ns: 'error' }));
  },
});
