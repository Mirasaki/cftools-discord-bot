import { Request, Response, NextFunction } from 'express';

export enum APIErrorCodes {
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNKNOWN_RESOURCE = 'UNKNOWN_RESOURCE',
}

export class APIError extends Error {
  body: Record<string, unknown> | null;
  constructor(
    public error: APIErrorCodes,
    public code: number,
    public message: string,
    body?: Record<string, unknown>
  ) {
    super(message);
    this.body = body ?? null;
  }
}

/*
  This apiErrorHandler function
  be the only place in our application where we
  define the { error: ... } field to utilize our
  error handler
*/
export const apiErrorHandler = (
  err: Error | APIError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Expected errors
  if (err instanceof APIError) {
    const body = { ok: false, ...err};
    res.status(err.code).send(body);
    return;
  }

  // Unexpected Errors, we should really handle these
  if (process.env.NODE_ENV === 'production') {
    console.error('500 - Internal Server Error encountered:');
    console.error(err);
  }

  // Unexpected errors
  res.status(500).send({
    ok: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Something went wrong on our side, please try again later. This issue has been logged to the developers.'
      : `[in-dev] Error: ${ err.stack ?? err.message ?? err }`,
  });
};

export const createAPIError = (
  error: APIErrorCodes,
  code: number,
  message: string,
  body?: Record<string, unknown>
): APIError => {
  return new APIError(error, code, message, body);
};

export const invalidRequestError = (body?: Record<string, unknown>): APIError =>
  createAPIError(APIErrorCodes.INVALID_REQUEST, 400, 'Invalid request', body);

export const unknownResourceError = (body?: Record<string, string>): APIError =>
  createAPIError(APIErrorCodes.UNKNOWN_RESOURCE, 404, 'Unknown resource', body);
