import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import LimitUsage from "../models/limit-usage.model";
import ResponseError from "../utils/error";
import { logger } from "../utils/logging";
import { AuthRequest } from "./auth.middleware";

export const limitUsageMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const LIMIT = 40;
    const { id } = (req as AuthRequest).user;

    const limitUsage = await LimitUsage.findOneAndUpdate(
      { user_id: id },
      [
        {
          $set: {
            max_usage: { $ifNull: ["$max_usage", LIMIT] },
            usage: {
              $cond: {
                if: { $gt: [{ $ifNull: ["$usage", LIMIT] }, 0] },
                then: {
                  $subtract: [{ $ifNull: ["$usage", LIMIT] }, 1],
                },
                else: 0,
              },
            },
          },
        },
      ],
      { upsert: true, new: true, updatePipeline: true },
    );

    res.set({
      "X-Session-Limit": limitUsage.max_usage.toString(),
      "X-Session-Remaining": limitUsage.usage.toString(),
    });

    if (limitUsage.usage <= 0) {
      throw new ResponseError(
        "Daily messages limit reached.",
        StatusCodes.TOO_MANY_REQUESTS,
      );
    }

    logger.debug(`Session limit updated for key: ${id}`, {
      limit: limitUsage.max_usage,
      remaining: limitUsage.usage,
    });

    next();
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    }

    logger.error("Error in session limit middleware:", error);
    throw new ResponseError(
      "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
