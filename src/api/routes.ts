import { Router } from "express";
import authRouter from "../routers/auth.router";
import userRouter from "../routers/user.router";
import agentRouter from "../routers/agent.router";
import topicRouter from "../routers/topic.router";
import limitUsageRouter from "../routers/limit-usage.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/agents", agentRouter);
router.use("/topics", topicRouter);
router.use("/limit-usage", limitUsageRouter);

export default router;
