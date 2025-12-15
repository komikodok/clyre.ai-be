import { z, object } from "zod";

export const createVariantSchema = object({
    productId: z.string().max(38),
    name: z.string().max(50).min(3),
    stock: z.number().min(0)
})