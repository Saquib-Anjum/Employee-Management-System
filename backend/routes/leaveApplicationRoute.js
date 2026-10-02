import express from "express";

const leaveRouter = express.Router();
import { protect,protectAdmin } from "../middlewares/auth.js";
import {
  createLeave,
  getLeave,
  updateLeave,
} from "../controllers/leaveController.js";
leaveRouter.post("/", protect, createLeave);
leaveRouter.get("/", protect, getLeave);
leaveRouter.patch("/:id", protect, protectAdmin, updateLeave);

export default leaveRouter;
