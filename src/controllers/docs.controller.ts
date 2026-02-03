import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { docsService } from "../services/docs.service";
import { successResponse } from "../utils/response";
import { DocsUploadRequest } from "../types/docs.type";
import { CloudinaryRequest } from "../middlewares/upload.middleware";

class DocsController {
  static async upload(
    req: CloudinaryRequest,
    res: Response,
    next: NextFunction,
  ) {
    const { topic } = req.params;
    let { type, url, title } = req.body as DocsUploadRequest;

    const file = req.file;

    if (!type) {
      if (file) {
        type = "file";
      } else if (url) {
        type = "url";
      }
    }

    const result = await docsService.addDocument(topic, type, {
      file,
      url,
      title,
      cloudinaryPublicId: req.cloudinary?.publicId,
    });

    successResponse(res, StatusCodes.OK, "Document processing started", result);
  }
}

export default DocsController;
