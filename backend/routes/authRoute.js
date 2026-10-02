import express from 'express';
const authRouter = express.Router();
import { changePassword, login, session } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

authRouter.post('/login',login);
authRouter.get('/session',protect,session);
authRouter.post('/change-password',protect,changePassword)

export default authRouter;

