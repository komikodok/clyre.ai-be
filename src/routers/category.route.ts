import { Router } from 'express';
import rescue from 'express-rescue';
import categoryController from '../controllers/category.controller';

const categoryRouter = Router();

categoryRouter.get('/', rescue(categoryController.getAll))
categoryRouter.post('/', rescue(categoryController.create))
categoryRouter.delete('/:categoryId', rescue(categoryController.delete))

export default categoryRouter;
