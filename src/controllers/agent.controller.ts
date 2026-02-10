import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../utils/response";
import { logger } from "../utils/logging";
import { agentService } from "../services/agent.service";
import * as crypto from "crypto";
import { AuthRequest } from "../middlewares/auth.middleware";

class AgentController {
  static async new(req: Request, res: Response, next: NextFunction) {
    const { prompt } = req.body;

    const result = await agentService.new(prompt);

    successResponse(res, StatusCodes.OK, "", result);
  }

  static async consult(req: Request, res: Response, next: NextFunction) {
    const { topic } = req.params;
    const { prompt } = req.body;
    const { id, username } = (req as AuthRequest).user;

    const result = await agentService.consult(
      { topic },
      { prompt, user_id: id, username },
    );

    successResponse(res, StatusCodes.OK, "", result);
  }

  static async stream(req: AuthRequest, res: Response, next: NextFunction) {
    const { topic } = req.params;
    const { prompt } = req.body;
    const { id, username } = (req as AuthRequest).user;

    const abortController = new AbortController();
    const signal = abortController.signal;

    res.on("close", () => {
      logger.info("Client disconnected");
      abortController.abort();
    });

    try {
      req.setTimeout(200000);
      res.setTimeout(200000);

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      const result = agentService.stream(
        { topic },
        { prompt, user_id: id, username },
        signal,
      );

      for await (const event of result) {
        res.write(`event: ${event.type}\n`);
        res.write(`data: ${JSON.stringify(event.value)}\n\n`);
      }

      res.end();
    } catch (error: any) {
      const errorId = crypto.randomUUID();
      logger.error(`Error ID: ${errorId}`);
      logger.error(`Error on stream: ${error}`);

      if (!res.headersSent) {
        res.setHeader("Content-Type", "text/event-stream");
        res.flushHeaders();
      }

      res.write(`event: error\n`);
      res.write(
        `data: ${JSON.stringify({
          message: "Oops. Something went wrong, please try again later.",
          error_id: errorId,
        })}\n\n`,
      );

      res.end();
    }
  }
}

export default AgentController;
