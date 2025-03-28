import type { Request, Response } from 'express';
import { slowDown } from 'express-slow-down';

/**
 * Middleware to apply rate-limiting with a gradual slowdown approach.
 *
 * This middleware implements a "speed limit" approach to rate limiting,
 * which gradually slows down responses based on the number of requests
 * a client has made within a given time window.
 *
 * The delay increases incrementally after a set number of requests.
 *
 * @documentation https://www.npmjs.com/package/express-slow-down
 */

export const WINDOW_IN_MILLISECONDS = 15 * 60 * 1000; // 15 minutes in milliseconds
export const DELAY_AFTER_REQUEST_COUNT = 3; // Delay after this many requests
export const DELAY_AFTER_REQUEST_COUNT_EXCEEDED_IN_MS = 100; // Delay increment for each additional request

/**
 * Rate limiting middleware configuration.
 * This will:
 * - Allow the first 3 requests without delay.
 * - Start delaying subsequent requests after the 3rd request by increasing delays.
 * - The delay increases by 100ms for each additional request (4th, 5th, 6th, etc.).
 * - The delay resets after the configured window (15 minutes).
 */
export const slowDownApi = slowDown({
  windowMs: WINDOW_IN_MILLISECONDS, // Time window in milliseconds (15 minutes)
  delayAfter: DELAY_AFTER_REQUEST_COUNT, // Number of requests before delay starts
  delayMs: (hits) => hits * DELAY_AFTER_REQUEST_COUNT_EXCEEDED_IN_MS, // Delay multiplier based on the number of requests

  message: (req: Request, _res: Response) => ({
    error: req.t('throttling_message', { ns: 'error' }), // Custom error message for throttling
  }),
});
