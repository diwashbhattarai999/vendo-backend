import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { logger } from '@/logger/winston.logger';

/**
 * Middleware to validate request schema using Zod.
 *
 * This middleware validates the request body, query, params, and headers
 * against a provided Zod schema. If the validation fails, it sends a
 * 400 Bad Request response with the validation errors.
 * If the validation succeeds, it modifies the request object to
 * include the parsed values and calls the next middleware.
 *
 * @param schema - The Zod schema to validate against.
 * @returns A middleware function that validates the request schema.
 * @throws CustomError - If the schema validation fails.
 */
export function validateSchema(schema: z.AnyZodObject) {
  return function (req: Request, res: Response, next: NextFunction) {
    const t = req.t;

    try {
      // Parse and validate the request against the provided schema
      const parsedSchema = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
      });

      // If validation is successful, assign the parsed values back to the request object
      // This allows the next middleware or route handler to access the validated data
      // without needing to re-parse it.
      req.body = parsedSchema.body;
      req.query = parsedSchema.query;
      req.params = parsedSchema.params;
      req.headers = parsedSchema.headers;

      // Proceed to the next middleware or route handler
      return next();
    } catch (error) {
      // If the validation fails, send a 400 Bad Request response
      // with the validation errors and a custom error message
      if (error instanceof z.ZodError) {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: t('schema_validation_error', { ns: 'error' }),
          errorList: error.errors.map((e) => ({
            code: e.code,
            message: e.message,
            field: e.path[1],
          })),
        });

        // Log the error for debugging purposes
        logger.error(t('schema_validation_error', { ns: 'error' }));
        return;
      }

      // Log the error for debugging purposes
      logger.error(t('schema_validation_error', { ns: 'error' }));

      // If the error is not a ZodError, throw a custom error
      throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.INVALID_JSON_CONFIG, t('general_error_message', { ns: 'error' }));
    }
  };
}
