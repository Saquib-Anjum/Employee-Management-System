import express from 'express';
import { protect } from '../middlewares/auth.js';
import { getDashboard } from '../controllers/dashboardController.js';
const dashboardRouter = express.Router();
dashboardRouter.get('/',protect,getDashboard)

export default dashboardRouter;
