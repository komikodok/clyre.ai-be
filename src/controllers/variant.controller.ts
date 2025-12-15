import { Request, Response } from "express"
import prisma from "../lib/prisma"
import variantService from "../services/variant.service"
import { successResponse } from "../utils/response"

class VariantController {
    async getAll(req: Request, res: Response) {
        const search = req.query?.search
        
        const variants = await variantService.getAll({
            search: search ? String(search) : undefined
        })

        successResponse(res, 200, 'Variants fetched successfully.', variants)
    }
    async create(req: Request, res: Response) {
        const variant = await variantService.create(req.body)

        successResponse(res, 201, 'Variant created successfully.', variant)
    }
    async delete(req: Request, res: Response) {
        const variant = await variantService.delete(req.params.id)

        successResponse(res, 200, 'Variant deleted successfully.', variant)
    }
}

export default new VariantController()