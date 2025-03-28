export class CustomError extends Error {
  override message: string;
  statusCode: number;
  errorCode: string;
  timestamp: Date;

  constructor(statusCode: number, errorCode: string, message: string) {
    super(message);

    this.name = this.constructor.name;

    this.statusCode = statusCode;
    this.message = message;
    this.errorCode = errorCode;

    this.timestamp = new Date();
  }
}
