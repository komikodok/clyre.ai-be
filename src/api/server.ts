import app from "./app";
import { connectDB } from "../config/database";
import { logger } from "../utils/logging";

const PORT = Number(process.env.PORT) || 5000

connectDB().then(() => {
    app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`))
})
