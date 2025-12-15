import { Request, Response } from "express"
import prisma from "../lib/prisma"
import { productService } from "../services/product.service"
import { successResponse } from "../utils/response"

class ProductController {
    async getAll(req: Request, res: Response) {
        const products = await productService.getAll(req.query)

        successResponse(res, 200, 'Products fetched successfully.', products)
    }
    async getProductById(req: Request, res: Response) {}
    async create(req: Request, res: Response) {}
    async update(req: Request, res: Response) {}
    async delete(req: Request, res: Response) {}
}

export default new ProductController()