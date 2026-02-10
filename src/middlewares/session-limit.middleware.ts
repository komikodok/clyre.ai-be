import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import ResponseError from "../utils/error";
import { logger } from "../utils/logging";
import Topic from "../models/topic.model";
import SessionMessage from "../models/session-message.model";

interface SessionLimitOptions {
  defaultLimit?: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
}

export const createSessionLimit = ({
  defaultLimit = 15,
  message = "Too many requests, please try again later.",
}: SessionLimitOptions = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { topic } = req.params;
      const { user_id } = req.body;

      const topicDoc = await Topic.findOne({ name: topic });
      if (!topicDoc) {
        throw new ResponseError("Topic not found", StatusCodes.NOT_FOUND);
      }

      const session = await SessionMessage.findOneAndUpdate(
        { user_id, topic_id: topicDoc._id },
        [
          {
            $set: {
              limit_session: {
                $cond: {
                  // When limit_session > 0
                  if: {
                    $gt: [
                      // If limit_session is null, use defaultLimit
                      { $ifNull: ["$limit_session", defaultLimit] },
                      0,
                    ],
                  },
                  // Do limit_session - 1
                  then: {
                    $subtract: [
                      // If limit_session is null, use defaultLimit
                      { $ifNull: ["$limit_session", defaultLimit] },
                      1,
                    ],
                  },
                  // Else set limit_session to 0
                  else: 0,
                },
              },
            },
          },
        ],
        { upsert: true, new: true, updatePipeline: true },
      );

      if (!session || !session.limit_session || session.limit_session <= 0) {
        res.set({
          "X-Session-Limit": defaultLimit.toString(),
          "X-Session-Remaining": "0",
        });

        throw new ResponseError(message, StatusCodes.TOO_MANY_REQUESTS);
      }

      res.set({
        "X-Session-Limit": defaultLimit.toString(),
        "X-Session-Remaining": session.limit_session?.toString(),
      });

      logger.debug(`Session limit updated for key: ${user_id}`, {
        limit: session.limit_session,
        remaining: session.limit_session,
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
};

export const sessionLimitMiddleware = createSessionLimit({
  defaultLimit: 50,
  message: "Daily session message limit reached.",
});
