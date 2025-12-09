import { Router } from 'express';
import rescue from 'express-rescue';
import authController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/login', rescue(authController.login));
authRouter.post('/register', rescue(authController.register))

export default authRouter;
