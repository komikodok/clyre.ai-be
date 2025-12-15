import { z, object } from "zod";

export const createProductSchema = object({
    sku: z.string().max(50).optional(),
    name: z.string().max(100).min(3),
    slug: z.string().max(100).min(3).optional(),
    description: z.string().optional(),
    priceAmount: z.number().min(0),
    priceCurrency: z.enum(['IDR', 'USD']).default('IDR'),
    stock: z.number().min(0).default(0),
    categoryId: z.string().max(38)
});

export const updateProductSchema = object({
    sku: z.string().max(50).optional(),
    name: z.string().max(100).min(3).optional(),
    slug: z.string().max(100).min(3).optional(),
    description: z.string().optional(),
    priceAmount: z.number().min(0).optional(),
    priceCurrency: z.enum(['IDR', 'USD']).optional(),
    stock: z.number().min(0).optional(),
    categoryId: z.string().max(38).optional()
});
