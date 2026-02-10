import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../utils/response";
import { logger } from "../utils/logging";
import { sessionService } from "../services/session.service";

class SessionController {
  static async getLimitSession(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { topic } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "user_id is required",
      });
      return;
    }

    const result = await sessionService.getLimitSession({
      topic,
      user_id: user_id as string,
    });

    successResponse(
      res,
      StatusCodes.OK,
      "Session limit retrieved successfully",
      result.data,
    );
  }

  static async resetLimitSession(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { topic } = req.params;
    const { user_id, limit } = req.body;

    if (!user_id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "user_id is required",
      });
    }

    const result = await sessionService.resetLimitSession({
      topic,
      user_id,
      limit,
    });

    successResponse(
      res,
      StatusCodes.OK,
      "Session limit reset successfully",
      result.data,
    );
  }
}

export default SessionController;
