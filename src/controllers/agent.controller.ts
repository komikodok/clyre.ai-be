import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { agentService } from "../services/agent.service";
import { successResponse } from "../utils/response";

class AgentController {
    static async new(req: Request, res: Response, next: NextFunction) {
        const { prompt } = req.body

        const result = await agentService.new(prompt)

        successResponse(res, StatusCodes.OK, "", result)
    }
}

export default AgentController