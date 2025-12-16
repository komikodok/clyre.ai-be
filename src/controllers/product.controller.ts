import { Request, Response } from "express"
import prisma from "../lib/prisma"
import { productService } from "../services/product.service"
import { successResponse } from "../utils/response"

class ProductController {
    async getAll(req: Request, res: Response) {
        const { page, limit, search, sort } = req.query

        const queryParams = {
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            search: search as string | undefined,
            sort: sort as 'asc' | 'desc' | undefined
        }

        const products = await productService.getAll(queryParams)

        successResponse(res, 200, 'Products fetched successfully.', products)
    }

    async getProductById(req: Request, res: Response) {
        const { productId } = req.params
        const product = await productService.getById(productId)

        successResponse(res, 200, 'Product fetched successfully.', product)
    }

    async create(req: Request, res: Response) {
        const product = await productService.create(req.body)

        successResponse(res, 201, 'Product created successfully.', product)
    }

    async update(req: Request, res: Response) {
        const { productId } = req.params
        const product = await productService.update(productId, req.body)

        successResponse(res, 200, 'Product updated successfully.', product)
    }

    async delete(req: Request, res: Response) {
        const { productId } = req.params
        await productService.delete(productId)

        successResponse(res, 200, 'Product deleted successfully.', null)
    }
}

export default new ProductController()