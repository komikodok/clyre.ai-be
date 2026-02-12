import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../utils/response";
import { logger } from "../utils/logging";
import { limitUsageService } from "../services/limit-usage.service";
import { AuthRequest } from "../middlewares/auth.middleware";

class LimitUsageController {
  static async getLimitUsage(req: Request, res: Response, next: NextFunction) {
    const { id } = (req as AuthRequest).user;

    const result = await limitUsageService.getLimitUsage(id);

    successResponse(
      res,
      StatusCodes.OK,
      "Limit usage retrieved successfully",
      result.data,
    );
  }

  static async resetLimitUsage(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = (req as AuthRequest).user;

    const result = await limitUsageService.resetLimitUsage(id);

    successResponse(
      res,
      StatusCodes.OK,
      "Limit usage reset successfully",
      result.data,
    );
  }
}

export default LimitUsageController;
