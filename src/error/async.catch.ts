import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Generic type for asynchronous Express route handlers or middleware
 * that preserves parameter types throughout the request chain.
 */
export type TAsyncFunction<P = unknown, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction,
) => Promise<void>;

/**
 * Wraps an asynchronous Express route handler or middleware to catch errors
 * and pass them to the next error-handling middleware.
 *
 * @template P - Type of the request parameters (default: `unknown`)
 * @template ResBody - Type of the response body (default: `unknown`)
 * @template ReqBody - Type of the request body (default: `unknown`)
 * @template ReqQuery - Type of the request query (default: `unknown`)
 *
 * @param fn - The asynchronous function to wrap
 * @returns A new function that catches errors and passes them to the next middleware
 */
export function asyncCatch<P = unknown, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown>(
  fn: TAsyncFunction<P, ResBody, ReqBody, ReqQuery>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
