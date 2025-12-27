import { Router } from 'express';
import rescue from 'express-rescue';
import AuthController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/login', rescue(AuthController.login));
authRouter.post('/register', rescue(AuthController.register))

export default authRouter;
