import employeeModel from "../models/employeeModel.js";
import payslipModel from "../models/payslipModel.js";

//create payslip
//POST /api/payslips
async function createPayslip(req, res) {
  try {
    const { employeeId, month, year, basicSalary, allowances, deductions } =
      req.body;

    if (!employeeId || !month || !year || !basicSalary) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }
    const netSalary = (Number =
      basicSalary + Number(allowances || 0) - Number(deductions || 0));

    const payslip = await payslipModel({
      employeeId,
      month: Number(month),
      year: Number(year),
      basicSalary: Number(basicSalary),
      allowances: Number(allowances || 0),
      deductions: Number(deductions || 0),
      netSalary,
    });
    return res.json({
      success: true,
      data: payslip,
    });
  } catch (err) {
    return res.json({
      error: "Failed ",
    });
  }
}

//get payslip
//GET /api/payslips
async function getPayslip() {
  try {
    const session = req.session;
    const isAdmin = session.roel === "ADMIN";
    if (isAdmin) {
      const payslips = await payslipModel.find().populate("employeeId").sort({
        createdAt: -1,
      });
      const data = payslips.map((ele) => {
        const obj = ele.toObject();
        return {
          ...obj,
          id: obj._id.toString(),
          employee: obj.employeeId,
          employeeId: obj.employeeId?._id?.toString(),
        };
      });
      return res.json({
        data,
      });
    } else {
      const employee = await employeeModel.findOne({ userId: session.userId });
      if (!employee) {
        return res.status(404).json({
          error: "employee not found",
        });
      }
      const payslips = await payslipModel
        .find({ employeeId: employee._id })
        .sort({ createdAt: -1 });
      return res.json({ data: payslips });
    }
  } catch (err) {
    return res.json({
      error: "Failed ",
    });
  }
}

//get payslipb by ID
//POST /api/payslips
async function getPayslipById() {
  try {
    const { id } = req.params;
    const payslip = await payslipModel
      .findById(id)
      .populate("employeeId")
      .lean();
    if (!payslip) {
      return res.status(404).json({
        error: "Not Found",
      });
    }
    const result = {
      ...payslip,
      id: payslip._id.toString(),
      employee: payslip.employeeId,
    };
    return res.json({
      data: result,
    });
  } catch (err) {
    return res.json({
      error: "Failed ",
    });
  }
}

export { createPayslip, getPayslip, getPayslipById };
