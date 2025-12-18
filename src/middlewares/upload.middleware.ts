import multer from "multer";
import cloudinary from "../utils/cloudinary";
import { Request, Response, NextFunction } from 'express'


export interface CloudinaryRequest extends Request {
    cloudinary: {
        url: string;
        publicId: string;
        alt: string;
    }
}

export const uploadImage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next()

    try {
        const upload = async (file: any) => {
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                {
                    folder: 'clyre.ai'
                }
            )

            return {
                url: result.secure_url,
                publicId: result.public_id,
                alt: file.originalname
            }
        }

        if (req.file) {
            (req as CloudinaryRequest).cloudinary = await upload(req.file)
        }

        next()
    } catch (err) {
        next(err)
    }
}
