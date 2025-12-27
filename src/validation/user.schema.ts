import { z, object } from 'zod';

export const userSchema = object({
    email: z.email(),
    username: z.string().max(50).min(3),
    password: z.string().max(50).min(6),
    confirm_password: z.string().max(50).min(6),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export const updateUserSchema = object({
    email: z.email().optional(),
    username: z.string().max(50).min(3).optional(),
    password: z.string().max(50).min(6).optional(),
    confirm_password: z.string().max(50).min(6).optional(),
}).refine((data) => {
    if (data.password || data.confirm_password) {
        return data.password === data.confirm_password;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});