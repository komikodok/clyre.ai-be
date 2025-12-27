import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import userService from '../services/user.service'
import { successResponse } from '../utils/response'
import { AuthRequest } from '../middlewares/auth.middleware'

class UserController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        const users = await userService.getAll()

        successResponse(res, StatusCodes.OK, 'Users fetched successfully.', users)
    }
    static async getUserById(req: Request, res: Response, next: NextFunction) {
        const user = await userService.getById(req.params.id)

        successResponse(res, StatusCodes.OK, 'User fetched successfully.', user)
    }
    static async getUserDetail(req: Request, res: Response, next: NextFunction) {
        const payload = (req as AuthRequest).user

        const user = await userService.getById(payload.id)

        successResponse(res, StatusCodes.OK, 'User fetched successfully.', user)
    }
    static async update(req: Request, res: Response, next: NextFunction) {
        const user = await userService.update(req.params.id, req.body)

        successResponse(res, StatusCodes.OK, 'User updated successfully.', user)
    }
}

export default UserController
