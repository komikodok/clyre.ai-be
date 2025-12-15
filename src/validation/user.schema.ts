import { z, object } from 'zod';

export const userSchema = object({
    email: z.email(),
    username: z.string().max(50).min(3),
    password: z.string().max(50).min(6),
})

export const updateUserSchema = userSchema.partial()