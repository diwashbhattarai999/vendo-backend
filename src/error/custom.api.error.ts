export class CustomError extends Error {
  override message: string;
  details: string;
  suggestion: string;
  statusCode: number;
  errorCode: string;
  timestamp: Date;

  constructor(statusCode: number, errorCode: string, message: string, details: string, suggestion: string) {
    super(message);

    this.name = this.constructor.name;

    this.statusCode = statusCode;
    this.message = message;
    this.errorCode = errorCode;
    this.details = details;
    this.suggestion = suggestion;

    this.timestamp = new Date();
  }
}
