import { z, object } from 'zod';

export const registerSchema = object({
    email: z.email(),
    username: z.string().max(50).min(3),
    password: z.string().max(50).min(6),
    confirm_password: z.string().max(50).min(6)
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export const loginSchema = object({
    email: z.email(),
    password: z.string().max(50).min(6)
})