import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../utils/response";
import { chatHistoryService } from "../services/chat-history.service";
import { AuthRequest } from "../middlewares/auth.middleware";

class ChatHistoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    const { topic } = req.params;
    const { id } = (req as AuthRequest).user;

    const chatHistory = await chatHistoryService.getAll(topic, id);

    successResponse(
      res,
      StatusCodes.OK,
      "Chat history fetched successfully.",
      chatHistory,
    );
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { topic } = req.params;
    const { id } = (req as AuthRequest).user;

    const result = await chatHistoryService.delete(topic, id);

    successResponse(
      res,
      StatusCodes.OK,
      "Chat history deleted successfully",
      result,
    );
  }
}

export default ChatHistoryController;
