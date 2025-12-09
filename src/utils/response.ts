import { Response } from "express"
import { logger } from "./logging"

const successResponse = (res: Response, code: number, message: string, data: any) => {
    return res.status(code).json({
        meta: {
            code,
            status: 'success',
            message
        },
        data: data
    })
}

const errorResponse = (res: Response, code: number, message: string, error: any) => {
    logger.error({
        meta: {
            code,
            status: 'error',
            message
        },
        error: error
    })
    
    return res.status(code).json({
        meta: {
            code,
            status: 'error',
            message
        },
        error: error
    })
}

export {
    successResponse,
    errorResponse
}