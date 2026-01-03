import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import AgentController from "../controllers/agent.controller";
import rescue from "express-rescue";


import docsRouter from "./docs.router";

const agentRouter = Router()

// agentRouter.use(authMiddleware)
agentRouter.post("/new", rescue(AgentController.new))
agentRouter.post("/consult/:topic", rescue(AgentController.consult))
agentRouter.use("/docs/:topic", docsRouter)

export default agentRouter
