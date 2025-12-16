import { Router } from "express";
import rescue from "express-rescue";
import productController from "../controllers/product.controller";


const productRouter = Router()

productRouter.get('/', rescue(productController.getAll))
productRouter.get('/:productId', rescue(productController.getProductById))
productRouter.post('/', rescue(productController.create))
productRouter.patch('/:productId', rescue(productController.update))
productRouter.delete('/:productId', rescue(productController.delete))

export default productRouter