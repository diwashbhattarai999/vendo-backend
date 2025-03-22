import type { Response } from 'express';

/**
 * Sends a structured HTTP response with a success status, message, and optional data.
 *
 * @param {Response} res - The Express response object.
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {string} message - The message to be included in the response.
 * @param {unknown} data - Optional data to include in the response (can be object, array, string, number, or null).
 * @returns {Response} The Express response object with the structured response.
 *
 * @example
 * sendResponse(res, 200, 'Request successful', { id: 123, name: 'John Doe' });
 */
export const sendHttpResponse = (res: Response, statusCode: number, message: string, data: unknown = null): Response => {
  const response = {
    success: true,
    status: statusCode,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};
