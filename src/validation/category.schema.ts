import { z, object } from 'zod'

export const categorySchema = object({
    name: z.string().max(50).min(3).toLowerCase(),
})