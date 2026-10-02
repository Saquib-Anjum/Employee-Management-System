import employeeModel from "../models/employeeModel.js";
import leaveApplicationModel from "../models/leaveApplicationModel.js";

//create Leave
//POST /api/leaves
async function createLeave(req, res) {
  try {
    const session = req.session;
    const employee = await employeeModel.findOne({ userId: session.userId });
    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }
    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated you can not apply for leave",
      });
    }
    const { type, startDate, endDate, reason } = req.body;
    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(startDate) <= today || new Date(endDate) <= today) {
      return res.status(400).json({
        error: "Leave dates must be in the future",
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        error: "End Date can not before start date",
      });
    }

    const leave = await leaveApplicationModel.create({
      employeeId: employee._id,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: "PENDING",
    });
    return res.json({
      success: true,
      data: leave,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to create Leave",
    });
  }
}

//Get Leaves
//GET /api/leaves
async function getLeave(req, res) {
  try {
    const session = req.session;
    const isAdmin = session.role === "ADMIN";
    if (isAdmin) {
      const status = req.query.status;
      const where = status ? { status } : {};
      const leaves = await leaveApplicationModel
        .find(where)
        .populate("employeeId")
        .sort({ createdAt: -1 });
      const data = leaves.map((ele) => {
        const obj = ele.toObject();
        return {
          ...obj,
          id: obj._id.toString(),
          employee: obj.employeeId,
          employeeId: obj.employeeId?._id.toString(),
        };
      });
      return res.json({
        data,
      });
    } else {
      const employee = await employeeModel
        .findOne({ userId: session.userId })
        .lean();
      if (!employee) {
        return res.status(404).json({
          error: "Employee not found",
        });
      }
      if (employee.isDeleted) {
        return res.status(403).json({
          error: "Your account is deactivated you can not apply for leave",
        });
      }

      const leaves = await leaveApplicationModel
        .find({ employeeId: employee._id })
        .sort({ createdAt: -1 });
      return res.json({
        data: leaves,
        employee: {
          ...employee,
          id: employee._id.toString(),
        },
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Failed to get Leave",
    });
  }
}
//Update Leave Status
//PATCH /api/leaves/id
async function updateLeave(req, res) {
  try {
    const {status} = req.body;
    if(!["APPROVED","REJECTED","PENDING"].includes(status)){
      return res.status(400).json({
        error:"Invalid Status"
      })
    }
    const leave = await leaveApplicationModel.findByIdAndUpdate(req.params.id,{status},{returnDocument:"after"});
    return res.json({
      success:true,
      data:leave,
    })
  } catch (err) {
     return res.status(500).json({
      error: "Failed to update Leave",
    });
  }
}

export { createLeave, getLeave, updateLeave };
