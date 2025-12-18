import { Request, Response } from "express";
import { productImageService } from "../services/product-image.service";
import { successResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";
import { CloudinaryRequest } from "../middlewares/upload.middleware"
import ResponseError from "../utils/error";

export const productImageController = {
    getAll: async (req: Request, res: Response) => {
        const { productId } = req.params;
        const result = await productImageService.getAll(productId);
        successResponse(res, StatusCodes.OK, 'Product images fetched successfully', result);
    },

    create: async (req: CloudinaryRequest, res: Response) => {
        const { productId } = req.params;
        const result = await productImageService.create(productId, req.cloudinary);
        successResponse(res, StatusCodes.CREATED, 'Product image created successfully', result);
    },

    delete: async (req: Request, res: Response) => {
        const { imageId } = req.params;
        await productImageService.delete(imageId);
        successResponse(res, StatusCodes.OK, 'Product image deleted successfully', null);
    }
};
