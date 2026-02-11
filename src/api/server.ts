import app from "./app";
import { connectDB } from "../config/database";
import { logger } from "../utils/logging";
import { cleanupMessagesJob } from "../jobs/cleanup-messages.job";

const PORT = Number(process.env.PORT) || 5000;

connectDB().then(() => {
  cleanupMessagesJob();
  app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
});
