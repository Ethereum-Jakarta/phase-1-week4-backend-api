export class ResponseError extends Error {
  public statusCode: number;
  public details?: Record<string, string> | undefined;
  constructor(
    statusCode: number,
    message: string,
    details?: Record<string, string>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
