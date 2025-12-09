import { Router } from 'express';
import rescue from 'express-rescue';
import userController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';

const userRouter = Router();

userRouter.get('/', rescue(userController.getAll))

userRouter.use(authMiddleware)

userRouter.get('/profile', rescue(userController.getUserDetail))
userRouter.get('/:id', rescue(userController.getUserById))
userRouter.put('/:id', rescue(userController.update))

export default userRouter;
