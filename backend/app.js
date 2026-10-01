import express from "express";
import cors from "cors";
import dotenv from "dotenv"

import multer from "multer";
const app = express();
//middlewares
dotenv.config()
app.use(express.json());
app.use(cors());
app.use(multer().none());
//route

export default app;
