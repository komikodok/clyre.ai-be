import prisma from "../lib/prisma";
import ResponseError from "../utils/error";
import { CreateProductImageData } from "../types/product-image.type";
import { createProductImageSchema } from "../validation/product-image.schema";
import validate from "../validation/validation";
import { StatusCodes } from "http-status-codes";
import cloudinary from "../utils/cloudinary";

export const productImageService = {
    getAll: async (productId: string) => {
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            throw new ResponseError("Product not found", StatusCodes.NOT_FOUND);
        }

        const images = await prisma.productImage.findMany({
            where: { productId }
        });

        return { data: images };
    },

    create: async (productId: string, data: CreateProductImageData) => {
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            throw new ResponseError("Product not found", StatusCodes.NOT_FOUND);
        }

        const productImageValidate = validate(createProductImageSchema, data);

        const image = await prisma.productImage.create({
            data: {
                ...productImageValidate,
                productId
            }
        });

        return { data: image };
    },

    delete: async (imageId: string) => {
        const image = await prisma.productImage.findUnique({
            where: { id: imageId }
        });

        if (!image) {
            throw new ResponseError("Image not found", StatusCodes.NOT_FOUND);
        }

        await cloudinary.uploader.destroy(image.publicId)

        await prisma.productImage.delete({
            where: { id: imageId }
        });

        return { data: null };
    },
};
