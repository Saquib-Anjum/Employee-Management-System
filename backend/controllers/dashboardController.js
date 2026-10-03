// Get dashboard for employee and admin

import { DEPARTMENTS } from "../constants/departments.js";
import attendanceModel from "../models/attendanceModel.js";
import employeeModel from "../models/employeeModel.js";
import leaveApplicationModel from "../models/leaveApplicationModel.js";
import payslipModel from "../models/payslipModel.js";

async function getDashboard(req, res) {
  try {
    const session = req.session;
    if (session.role === "ADMIN") {
      //admin
      const [totalEmployees, totalAttendance, pendingLeaves] =
        await Promise.all([
          employeeModel.countDocuments({ isDeleted: { $ne: true } }),
          attendanceModel.countDocuments({
            date: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lt: new Date(new Date().setHours(24, 0, 0, 0)),
            },
          }),
          leaveApplicationModel.countDocuments({ status: "PENDING" }),
        ]);
      return res.json({
        role: "ADMIN",
        totalEmployees,
        totalDepartments: DEPARTMENTS.length,
        totalAttendance,
        pendingLeaves,
      });
    } else {
      //employee
      const employee = await employeeModel
        .findOne({ userId: session.userId })
        .lean();
      if (!employee) {
        return res.status(404).json({
          error: "Empoyee not found",
        });
      }
      const today = new Date();
      const [currentMonthAttendance, pendingLeaves, latestPayslip] =
        await Promise.all([
          attendanceModel.countDocuments({
            employeeId: employee._id,
            date: {
              $gte: new Date(today.getFullYear(), today.getMonth(), 1),
              $lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
            },
          }),
          leaveApplicationModel.countDocuments({
            employeeId: employee._id,
            status: "PENDING",
          }),
          payslipModel
            .findOne({ employeeId: employee._id })
            .sort({ createdAt: -1 })
            .lean(),
        ]);

      res.json({
        role: "EMPLOYEE",
        employee: {
          ...employee,
          id: employee._id.toString(),
        },
        currentMonthAttendance,
        pendingLeaves,
        latestPayslip: latestPayslip
          ? { ...latestPayslip, id: latestPayslip._id.toString() }
          : null,
      });
    }
  } catch (err) {
    console.error("Dashboard", err);
    return res.status(500).json({
      error: "Failed",
    });
  }
}

export { getDashboard };
