import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import AgentController from "../controllers/agent.controller";
import rescue from "express-rescue";
import docsRouter from "./docs.router";
import { rateLimitMiddleware } from "../middlewares/rate-limit.middleware";
import { sessionLimitMiddleware } from "../middlewares/session-limit.middleware";

const agentRouter = Router();

agentRouter.use(authMiddleware);
agentRouter.use(rateLimitMiddleware.perSecond(1, "user"));
agentRouter.use(rateLimitMiddleware.perMinute(10, "user"));
agentRouter.use(rateLimitMiddleware.perHour(50, "user"));
agentRouter.use(rateLimitMiddleware.perDay(100, "user"));

agentRouter.post("/new", rescue(AgentController.new));
agentRouter.post(
  "/consult/:topic",
  sessionLimitMiddleware,
  rescue(AgentController.consult),
);
agentRouter.post(
  "/stream/:topic",
  sessionLimitMiddleware,
  rescue(AgentController.stream),
);
agentRouter.use("/docs/:topic", docsRouter);

export default agentRouter;
