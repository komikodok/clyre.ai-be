import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ResponseError from '../utils/error';
import { errorResponse } from '../utils/response';
import { ZodError } from 'zod';
import { logger } from '../utils/logging';

const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  switch (true) {
    case err instanceof ResponseError:
      return errorResponse(res, err.code, err.message, err.message)
    case err instanceof ZodError:
      const issues = err.issues
      return errorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        err.message,
        issues.map((issue) => ({
          path: issue.path,
          message: issue.message
        }))
      )
    default:
      return errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong', err)
  }
}

export {
  errorMiddleware
}
