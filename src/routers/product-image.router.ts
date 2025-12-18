import { Router } from "express";
import rescue from "express-rescue";
import { productImageController } from "../controllers/product-image.controller";
import { uploadImage, uploadToCloudinary } from "../middlewares/upload.middleware";

const productImageRouter = Router({ mergeParams: true });

productImageRouter.get('/', rescue(productImageController.getAll));
productImageRouter.delete('/:imageId', rescue(productImageController.delete));
productImageRouter.post(
    '/',
    uploadImage.single('image'),
    uploadToCloudinary,
    rescue(productImageController.create)
);

export default productImageRouter;
