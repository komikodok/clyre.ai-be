import authService from '../services/auth.service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../utils/response';

class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    await authService.register(req.body)

    successResponse(res, StatusCodes.CREATED, 'User registered successfully.', null)
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const data = await authService.login(req.body)

    successResponse(res, StatusCodes.OK, 'Login successful.', data)
  }
}

export default AuthController;
