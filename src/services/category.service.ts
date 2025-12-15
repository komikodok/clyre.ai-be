import { StatusCodes } from "http-status-codes"
import prisma from "../lib/prisma"
import ResponseError from "../utils/error"
import { categorySchema } from "../validation/category.schema"
import validate from "../validation/validation"

const categoryService = {
    getAll: async (query?: { search?: string }) => {

        const search = query?.search

        const categories = await prisma.category.findMany({
            where: search ? { name: { contains: search } } : {}
        })

        return { data: categories }
    },
    create: async (data: { name: string }) => {
        const categoryValidate = validate(categorySchema, data)

        const countCategory = await prisma.category.count({ where: { name: categoryValidate.name } })
        if (countCategory === 1) {
            throw new ResponseError("Category already exists", StatusCodes.CONFLICT)
        }

        const createCategory = await prisma.category.create({ 
            data: {
                name: categoryValidate.name.toLowerCase()
            }
        })

        return { data: createCategory }
    },
    delete: async (id: string) => {
        const countCategory = await prisma.category.count({ where: { id } })
        if (countCategory === 0) {
            throw new ResponseError("Category is not found", StatusCodes.NOT_FOUND)
        }

        await prisma.category.delete({ where: { id } })

        return null
    }
}

export default categoryService