import employeeModel from "../models/employeeModel.js";
import payslipModel from "../models/payslipModel.js";

// Create Payslip
// POST /api/payslips
async function createPayslip(req, res) {
  try {
    const { employeeId, month, year, basicSalary, allowances, deductions } =
      req.body;

    if (
      !employeeId ||
      !month ||
      !year ||
      basicSalary === undefined ||
      basicSalary === null
    ) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }

    const basic = Number(basicSalary);
    const allowance = Number(allowances || 0);
    const deduction = Number(deductions || 0);

    if (
      Number.isNaN(basic) ||
      Number.isNaN(allowance) ||
      Number.isNaN(deduction)
    ) {
      return res.status(400).json({
        error: "Salary values must be valid numbers",
      });
    }

    const netSalary = basic + allowance - deduction;

    const payslip = await payslipModel.create({
      employeeId,
      month: Number(month),
      year: Number(year),
      basicSalary: basic,
      allowances: allowance,
      deductions: deduction,
      netSalary,
    });

    return res.status(201).json({
      success: true,
      data: payslip,
    });
  } catch (err) {
    console.error("Create Payslip Error:", err);

    return res.status(500).json({
      error: "Failed to create payslip",
      message: err.message,
    });
  }
}

// Get Payslips
// GET /api/payslips
async function getPayslip(req, res) {
  try {
    const session = req.session;

    // Fixed: roel -> role
    const isAdmin = session?.role === "ADMIN";

    if (isAdmin) {
      const payslips = await payslipModel
        .find()
        .populate("employeeId")
        .sort({ createdAt: -1 });

      const data = payslips.map((payslip) => {
        const obj = payslip.toObject();

        return {
          ...obj,
          id: obj._id.toString(),
          employee: obj.employeeId,
          employeeId: obj.employeeId?._id?.toString(),
        };
      });

      return res.status(200).json({
        data,
      });
    }

    // Employee
    const employee = await employeeModel.findOne({
      userId: session?.userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const payslips = await payslipModel
      .find({
        employeeId: employee._id,
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      data: payslips,
    });
  } catch (err) {
    console.error("Get Payslip Error:", err);

    return res.status(500).json({
      error: "Failed to fetch payslips",
      message: err.message,
    });
  }
}

// Get Payslip By ID
// GET /api/payslips/:id
async function getPayslipById(req, res) {
  try {
    const { id } = req.params;

    const payslip = await payslipModel
      .findById(id)
      .populate("employeeId")
      .lean();

    if (!payslip) {
      return res.status(404).json({
        error: "Payslip not found",
      });
    }

    const result = {
      ...payslip,
      id: payslip._id.toString(),
      employee: payslip.employeeId,
      employeeId: payslip.employeeId?._id?.toString(),
    };

    return res.status(200).json({
      data: result,
    });
  } catch (err) {
    console.error("Get Payslip By ID Error:", err);

    return res.status(500).json({
      error: "Failed to fetch payslip",
      message: err.message,
    });
  }
}

export { createPayslip, getPayslip, getPayslipById };
