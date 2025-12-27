import { Router } from 'express';
import rescue from 'express-rescue';
import UserController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';

const userRouter = Router();

userRouter.get('/', rescue(UserController.getAll))

userRouter.use(authMiddleware)

userRouter.get('/profile', rescue(UserController.getUserDetail))
userRouter.get('/:id', rescue(UserController.getUserById))
userRouter.put('/:id', rescue(UserController.update))

export default userRouter;
