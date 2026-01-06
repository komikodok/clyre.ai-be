import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import topicServices from "../services/topic.service";
import { successResponse } from "../utils/response";

class TopicController {
  static async create(req: Request, res: Response, next: NextFunction) {
    const result = await topicServices.create(req.body);

    successResponse(
      res,
      StatusCodes.CREATED,
      "Topic created successfully",
      result
    );
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    const result = await topicServices.getAll();

    successResponse(
      res,
      StatusCodes.OK,
      "Topics retrieved successfully",
      result
    );
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const result = await topicServices.delete(id);

    successResponse(res, StatusCodes.OK, "Topic deleted successfully", result);
  }
}

export default TopicController;
