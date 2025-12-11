import { Request, Response } from "express"
import categoryService from "../services/category.service"
import { successResponse } from "../utils/response"

class CategoryController {
    async getAll(req: Request, res: Response) {
        const search = req.query.search
        
        const categories = await categoryService.getAll({
            search: search ? String(search) : undefined
        })

        successResponse(res, 200, 'Categories fetched successfully.', categories)
    }
    async create(req: Request, res: Response) {
        const category = await categoryService.create(req.body)

        successResponse(res, 201, 'Category created successfully.', category)
    }
    async delete(req: Request, res: Response) {
        const category = await categoryService.delete(req.params.id)

        successResponse(res, 200, 'Category deleted successfully.', category)
    }
}

export default new CategoryController()