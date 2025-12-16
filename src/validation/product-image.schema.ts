import { z, object } from "zod";

export const createProductImageSchema = object({
    url: z.string().url(),
    alt: z.string().optional()
});

export const updateProductImageSchema = object({
    url: z.string().url().optional(),
    alt: z.string().optional()
});
