export class ResponseError extends Error {
  constructor(
    public code: number,
    public message: string,
    public details?: Record<string, string>,
  ) {
    super(message);
  }
}
