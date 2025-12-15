import { Router } from "express";
import rescue from "express-rescue";
import productController from "../controllers/product.controller";


const productRouter = Router()

productRouter.get('/', rescue(productController.getAll))
productRouter.get('/:id', rescue(productController.getProductById))
productRouter.post('/', rescue(productController.create))
productRouter.patch('/:id', rescue(productController.update))
productRouter.delete('/:id', rescue(productController.delete))

export default productRouter