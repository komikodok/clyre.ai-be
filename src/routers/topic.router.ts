import { Router } from "express";
import TopicController from "../controllers/topic.controller";
import rescue from "express-rescue";

const topicRouter = Router();

topicRouter.get("/", rescue(TopicController.getAll));
topicRouter.post("/", rescue(TopicController.create));
topicRouter.delete("/:id", rescue(TopicController.delete));

export default topicRouter;
