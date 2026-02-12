import { logger } from "../utils/logging";
import LimitUsage from "../models/limit-usage.model";

class LimitUsageService {
  async getLimitUsage(user_id: string) {
    const limitUsage = await LimitUsage.findOne({
      user_id,
    });

    logger.debug(`Retrieved limit usage for user: ${user_id}`);

    return {
      data: {
        user_id,
        usage: limitUsage?.usage,
        max_usage: limitUsage?.max_usage,
      },
    };
  }

  async resetLimitUsage(user_id: string) {
    const limitUsage: any = await LimitUsage.findOneAndUpdate(
      { user_id },
      [
        {
          $set: { usage: "$max_usage" },
        },
      ],
      { upsert: true, new: true, updatePipeline: true },
    );

    return {
      data: {
        user_id,
        usage: limitUsage.usage,
        max_usage: limitUsage.max_usage,
        message: "Limit usage reset successfully",
      },
    };
  }
}

export const limitUsageService = new LimitUsageService();
