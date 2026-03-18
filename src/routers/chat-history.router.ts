import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import ChatHistoryController from "../controllers/chat-history.controller";
import rescue from "express-rescue";

const chatHistoryRouter = Router();

chatHistoryRouter.use(authMiddleware);

chatHistoryRouter.get("/:topic", rescue(ChatHistoryController.getAll));
chatHistoryRouter.delete("/:topic", rescue(ChatHistoryController.delete));

export default chatHistoryRouter;
