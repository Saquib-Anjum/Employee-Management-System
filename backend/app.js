import express from "express";
import cors from "cors";
import dotenv from "dotenv"

import multer from "multer";
import authRouter from "./routes/authRoute.js";
import employeeRouter from "./routes/employeeRoute.js";
import profileRouter from "./routes/profileRoute.js";
import attendanceRouter from "./routes/attendanceRoute.js";

const app = express();
//middlewares
dotenv.config()
app.use(express.json());
app.use(cors());
app.use(multer().none());
//route
app.use('/api/auth',authRouter);
app.use('/api/employees',employeeRouter);
app.use('/api/profile',profileRouter);
app.use('/api/attendance',attendanceRouter);
app.get('/',(req,res)=>{
  res.json({
    success:true,
    message:"server is alive"
  })
})
export default app;
