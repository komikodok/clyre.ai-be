import authService from '../services/auth.service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../utils/response';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    await authService.register(req.body)

    successResponse(res, StatusCodes.CREATED, 'User registered successfully.', null)
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const token = await authService.login(req.body)

    successResponse(res, StatusCodes.OK, 'Login successful.', { token })
  }
}

export default new AuthController();
