import { Router } from 'express';
import authRouter from '../routers/auth.router';
import userRouter from '../routers/user.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);

export default router;
