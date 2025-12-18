import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { errorResponse } from '../utils/response';

export interface AuthRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token)
    return errorResponse(res, StatusCodes.UNAUTHORIZED, 'Unauthorized', 'No token provided.')

  try {
    const user = jwt.verify(token) as JwtPayload & { id: string, username: string }
    (req as AuthRequest).user = user
    return next();
  } catch {
    return errorResponse(res, StatusCodes.UNAUTHORIZED, 'Unauthorized', 'No token provided.')
  }
};
