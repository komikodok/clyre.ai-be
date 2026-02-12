import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import LimitUsageController from "../controllers/limit-usage.controller";
import rescue from "express-rescue";
import { rateLimitMiddleware } from "../middlewares/rate-limit.middleware";

const limitUsageRouter = Router();

limitUsageRouter.use(authMiddleware);
limitUsageRouter.get("/", rescue(LimitUsageController.getLimitUsage));
limitUsageRouter.put("/reset", rescue(LimitUsageController.resetLimitUsage));

export default limitUsageRouter;
