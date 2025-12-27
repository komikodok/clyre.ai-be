import { Router } from 'express';
import authRouter from '../routers/auth.router';
import userRouter from '../routers/user.router';
import agentRouter from '../routers/agent.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/agents', agentRouter);


export default router;
