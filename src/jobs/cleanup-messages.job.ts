import * as cron from "node-cron";
import ChatMessage from "../models/chat-message.model";
import LimitUsage from "../models/limit-usage.model";
import { logger } from "../utils/logging";

export const cleanupMessagesJob = () => {
  cron.schedule("0 2 */2 * *", async () => {
    logger.info("Cleanup job started");

    const [chatRes, limitRes] = await Promise.allSettled([
      ChatMessage.deleteMany({}),
      LimitUsage.updateMany({}, { $set: { usage: 50 } }),
    ]);

    if (chatRes.status === "fulfilled") {
      logger.info(`Deleted ${chatRes.value.deletedCount} chat messages`);
    } else {
      logger.error(`Chat cleanup failed ${chatRes.reason}`);
    }

    if (limitRes.status === "fulfilled") {
      logger.info(`Reset usage for ${limitRes.value.modifiedCount} users`);
    } else {
      logger.error(`Usage reset failed ${limitRes.reason}`);
    }

    logger.info("Cleanup job finished");
  });
};
