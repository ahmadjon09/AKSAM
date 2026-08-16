// Typed API errors. Routes throw AppError and a global error handler turns
// it into a clean JSON envelope with the right status code.

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const badRequest = (message: string) => new AppError(400, "bad_request", message);
export const unauthorized = (message = "Authentication required") => new AppError(401, "unauthorized", message);
export const forbidden = (message = "You do not have permission for this action") => new AppError(403, "forbidden", message);
export const notFound = (message = "Not found") => new AppError(404, "not_found", message);
export const rateLimited = (message = "Too many requests, please slow down") => new AppError(429, "rate_limited", message);
