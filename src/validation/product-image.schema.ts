import { z, object } from "zod";

export const createProductImageSchema = object({
    url: z.string().url(),
    publicId: z.string(),
    alt: z.string().optional()
});