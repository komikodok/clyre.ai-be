import { StatusCodes } from "http-status-codes";
import { logger } from "../utils/logging";
import ResponseError from "../utils/error";
import Topic from "../models/topic.model";
import SessionMessage from "../models/session-message.model";

interface GetLimitSessionParams {
  topic: string;
  user_id: string;
}

interface ResetLimitSessionParams {
  topic: string;
  user_id: string;
  limit?: number;
}

class SessionService {
  async getLimitSession(params: GetLimitSessionParams) {
    const { topic, user_id } = params;

    const topicDoc = await Topic.findOne({ name: topic });
    if (!topicDoc) {
      throw new ResponseError("Topic not found", StatusCodes.NOT_FOUND);
    }

    const session = await SessionMessage.findOne({
      user_id,
      topic_id: topicDoc._id,
    });

    const defaultLimit = 15;
    const currentLimit = session?.limit_session ?? defaultLimit;

    logger.debug(`Retrieved session limit for user: ${user_id}`, {
      topic,
      limit: currentLimit,
    });

    return {
      data: {
        topic,
        user_id,
        limit_session: currentLimit,
        default_limit: defaultLimit,
      },
    };
  }

  async resetLimitSession(params: ResetLimitSessionParams) {
    const { topic, user_id, limit } = params;

    const topicDoc = await Topic.findOne({ name: topic });
    if (!topicDoc) {
      throw new ResponseError("Topic not found", StatusCodes.NOT_FOUND);
    }

    const defaultLimit = limit || 15;
    const resetLimit = Math.max(0, defaultLimit);

    const session: any = await SessionMessage.findOneAndUpdate(
      { user_id, topic_id: topicDoc._id },
      {
        $set: {
          limit_session: resetLimit,
          title: `${topicDoc.name}_topic`,
        },
      },
      { upsert: true, new: true },
    );

    return {
      data: {
        topic,
        user_id,
        limit_session: session.limit_session,
        message: "Session limit reset successfully",
      },
    };
  }
}

export const sessionService = new SessionService();
