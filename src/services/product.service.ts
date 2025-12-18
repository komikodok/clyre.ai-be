import { StatusCodes } from "http-status-codes"
import prisma from "../lib/prisma"
import ResponseError from "../utils/error"
import { createProductSchema, updateProductSchema } from "../validation/product.schema"
import validate from "../validation/validation"
import { slugify } from "../utils/slugify"
import {
    ProductQueryParams,
    CreateProductData,
    UpdateProductData
} from "../types/product.type"

const resolveProductStock = (product: {
    stock: number
    variants: { stock: number }[]
}) => {
    if (product.variants.length > 0) {
        return product.variants.reduce(
            (acc, v) => acc + v.stock,
            0
        )
    }

    return product.stock
}


export const productService = {
    getAll: async (query?: ProductQueryParams) => {
        const page = query?.page || 1
        const limit = query?.limit || 10
        const search = query?.search
        const sort = query?.sort === 'desc' ? 'desc' : 'asc'

        const skip = (page - 1) * limit

        const filter = search ? {
            OR: [
                { name: { contains: search } },
                { sku: { contains: search } }
            ]
        } : undefined

        const totalItems = await prisma.product.count({ where: filter })

        const products = await prisma.product.findMany({
            where: filter,
            orderBy: { name: sort },
            skip,
            take: limit,
            include: {
                category: true,
                images: true,
                variants: true
            }
        })

        const totalPages = Math.ceil(totalItems / limit)

        const mappedProducts = products.map(product => ({
            ...product,
            stock: resolveProductStock(product)
        }))

        return {
            data: mappedProducts,
            totalItems,
            totalPages,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            limit
        }
    },
    getById: async (productId: string) => {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                category: true,
                images: true,
                variants: true
            }
        })

        if (!product) {
            throw new ResponseError("Product not found", StatusCodes.NOT_FOUND)
        }

        return {
            data: {
                ...product,
                stock: resolveProductStock(product)
            }
        }
    },
    create: async (data: CreateProductData) => {
        const productValidate = validate(createProductSchema, data)

        const category = await prisma.category.findUnique({
            where: { id: productValidate.categoryId }
        })
        if (!category) {
            throw new ResponseError("Category not found", StatusCodes.NOT_FOUND)
        }

        const slug = productValidate.slug || slugify(productValidate.name)

        const existingProduct = await prisma.product.findUnique({
            where: { slug }
        })
        if (existingProduct) {
            throw new ResponseError("Product with this slug already exists", StatusCodes.CONFLICT)
        }

        const product = await prisma.product.create({
            data: {
                sku: productValidate.sku,
                name: productValidate.name,
                slug,
                description: productValidate.description,
                priceAmount: productValidate.priceAmount,
                priceCurrency: productValidate.priceCurrency || 'IDR',
                stock: productValidate.stock,
                categoryId: productValidate.categoryId,
            },
            include: {
                category: true,
                images: true,
                variants: true
            }
        })

        return { data: product }
    },
    update: async (productId: string, data: UpdateProductData) => {
        const productValidate = validate(updateProductSchema, data)

        const existingProduct = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!existingProduct) {
            throw new ResponseError("Product not found", StatusCodes.NOT_FOUND)
        }

        if (productValidate.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: productValidate.categoryId }
            })

            if (!category) {
                throw new ResponseError("Category not found", StatusCodes.NOT_FOUND)
            }
        }

        let slug = productValidate.slug
        if (productValidate.name && !productValidate.slug) {
            slug = slugify(productValidate.name)
        }

        if (slug && slug !== existingProduct.slug) {
            const slugExists = await prisma.product.findUnique({
                where: { slug }
            })

            if (slugExists) {
                throw new ResponseError("Product with this slug already exists", StatusCodes.CONFLICT)
            }
        }

        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                sku: productValidate.sku,
                name: productValidate.name,
                slug,
                description: productValidate.description,
                priceAmount: productValidate.priceAmount,
                priceCurrency: productValidate.priceCurrency,
                stock: productValidate.stock,
                categoryId: productValidate.categoryId,
            },
            include: {
                category: true,
                images: true,
                variants: true
            }
        })

        return { data: product }
    },
    delete: async (productId: string) => {
        const product = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            throw new ResponseError("Product not found", StatusCodes.NOT_FOUND)
        }

        await prisma.product.delete({
            where: { id: productId }
        })

        return { data: null }
    },
}