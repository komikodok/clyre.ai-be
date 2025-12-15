import { StatusCodes } from "http-status-codes"
import prisma from "../lib/prisma"
import { CreateProductVariant } from "../types/variant.type"
import ResponseError from "../utils/error"
import validate from "../validation/validation"
import { createVariantSchema } from "../validation/variant.schema"

const variantService = {
    getAll: async (query?: { search?: string }) => {
        const search = query?.search
        
        const variants = await prisma.productVariant.findMany({
            where: search ? { name: { contains: search } } : {}
        })

        return { data: variants }
    },
    create: async (data: CreateProductVariant) => {
        const variantValidate = validate(createVariantSchema, data)

        const countVariant = await prisma.productVariant.count({ where: { name: variantValidate.name } })
        if (countVariant === 1) {
            throw new ResponseError("Variant already exists", StatusCodes.CONFLICT)
        }
        
        const createVariant = await prisma.productVariant.create({
            data: {
                ...variantValidate,
                name: variantValidate.name.toLocaleLowerCase()
            }
        })

        return { data: createVariant }
    },
    delete: async (id: string) => {
        const countVariant = await prisma.productVariant.count({ where: { id } })
        if (countVariant === 0) {
            throw new ResponseError("Variant is not found", StatusCodes.NOT_FOUND)
        }

        await prisma.productVariant.delete({ where: { id } })

        return null
    }
}

export default variantService