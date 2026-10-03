import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import multer from "multer";
import authRouter from "./routes/authRoute.js";
import employeeRouter from "./routes/employeeRoute.js";
import profileRouter from "./routes/profileRoute.js";
import attendanceRouter from "./routes/attendanceRoute.js";
import leaveRouter from "./routes/leaveApplicationRoute.js";
import payslipsRouter from "./routes/payslipsRoute.js";
import dashboardRouter from "./routes/dashboardRouter.js";
//inngest imports
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();
//middlewares
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(multer().none());
//route
app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/profile", profileRouter);
app.use('/api/dashboard',dashboardRouter)
app.use("/api/attendance", attendanceRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/payslips", payslipsRouter);
// =================================================================================
// Set up the "/api/inngest" (recommended) routes with the serve handler
// Inngest
// Inngest endpoint:
// /api/inngest
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);
//==================================================================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "server is alive",
  });
});
export default app;
