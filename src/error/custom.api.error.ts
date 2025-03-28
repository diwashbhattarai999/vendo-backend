import type { TErrorCodes } from '@/constant/error.codes';
import { STATUS_CODES, type TStatusCodes } from '@/constant/status.codes';

/**
 * Custom error class that extends the native Error class.
 *
 * @class CustomError
 * @extends {Error}
 */
export class CustomError extends Error {
  override message: string;
  public statusCode: TStatusCodes;
  public errorCode: TErrorCodes;
  public timestamp: Date;

  constructor(statusCode: TStatusCodes = STATUS_CODES.INTERNAL_SERVER_ERROR, errorCode: TErrorCodes, message: string) {
    super(message);

    this.name = this.constructor.name;

    this.statusCode = statusCode;
    this.message = message;
    this.errorCode = errorCode;

    this.timestamp = new Date();
  }
}
