import { Router } from 'express';
import authRouter from '../routers/auth.router';
import userRouter from '../routers/user.router';
import categoryRouter from '../routers/category.route';
import variantRouter from '../routers/variant.router';
import productRouter from '../routers/product.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/variants', variantRouter);
router.use('/products', productRouter);

export default router;
