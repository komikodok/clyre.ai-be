import prisma from "../lib/prisma"

type ProductQueryParams = {
    page?: number,
    limit?: number,
    search?: string,
    sort?: 'asc' | 'desc'
}

export const productService = {
    getAll: async (query?: ProductQueryParams) => {
        const page = query?.page || 1
        const limit = query?.limit || 10
        const search = query?.search
        const sort = query?.sort || 'asc'

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
                category: true
            }
        })

        const totalPages = Math.ceil(totalItems / limit)

        return {
            data: products,
            totalItems,
            totalPages,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            limit
        }
    },
    getById: async () => {
        //
    },
    create: async () => {
        //
    },
    update: async () => {
        //
    },
    delete: async () => {
        //
    },
}