import express from 'express';
const profileRouter = express.Router();
import { protect } from '../middlewares/auth.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';


profileRouter.get('/',protect,getProfile);

profileRouter.post('/',protect,updateProfile);



export default profileRouter;

