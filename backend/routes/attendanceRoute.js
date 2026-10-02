import express from 'express';
const attendanceRouter = express.Router();
import {protect} from '../middlewares/auth.js'
import { checkInOut, getAttendance } from '../controllers/attendanceController.js';

attendanceRouter.post('/',protect,checkInOut);
attendanceRouter.get('/',protect,getAttendance);



export default attendanceRouter;