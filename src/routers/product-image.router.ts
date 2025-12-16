import { Router } from "express";
import rescue from "express-rescue";
import { productImageController } from "../controllers/product-image.controller";

const productImageRouter = Router({ mergeParams: true });

productImageRouter.get('/', rescue(productImageController.getAll));
productImageRouter.post('/', rescue(productImageController.create));
productImageRouter.delete('/:imageId', rescue(productImageController.delete));

export default productImageRouter;
