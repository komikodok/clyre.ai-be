import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import SessionController from "../controllers/session.controller";
import rescue from "express-rescue";
import { rateLimitMiddleware } from "../middlewares/rate-limit.middleware";

const sessionRouter = Router();

sessionRouter.use(authMiddleware);
sessionRouter.use(rateLimitMiddleware.perSecond(5, "user"));
sessionRouter.use(rateLimitMiddleware.perMinute(30, "user"));
sessionRouter.use(rateLimitMiddleware.perHour(100, "user"));

sessionRouter.get("/limit/:topic", rescue(SessionController.getLimitSession));

sessionRouter.put("/reset/:topic", rescue(SessionController.resetLimitSession));

export default sessionRouter;
