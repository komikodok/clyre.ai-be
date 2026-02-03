import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { errorResponse } from "../utils/response";
import ResponseError from "../utils/error";

export interface AuthRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    throw new ResponseError(
      "Unauthorized: You must be logged in.",
      StatusCodes.UNAUTHORIZED,
    );

  try {
    const user = jwt.verify(token) as JwtPayload & {
      id: string;
      username: string;
    };
    (req as AuthRequest).user = user;
    return next();
  } catch {
    throw new ResponseError(
      "Unauthorized: You must be logged in.",
      StatusCodes.UNAUTHORIZED,
    );
  }
};
