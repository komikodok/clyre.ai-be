import { ZodSchema } from "zod";
import ResponseError from "../utils/error";

export default function validate<T>(schema: ZodSchema<T>, data: T) {
    const validation = schema.safeParse(data)

    if (!validation.success) {
        throw new ResponseError(validation.error.message, 400)
    }
    
    return validation.data
}