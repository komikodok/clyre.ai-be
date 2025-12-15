import { Router } from 'express';
import rescue from 'express-rescue';
import variantController from '../controllers/variant.controller';

const variantRouter = Router();

variantRouter.get('/', rescue(variantController.getAll))
variantRouter.post('/', rescue(variantController.create))
variantRouter.delete('/:id', rescue(variantController.delete))

export default variantRouter;
