import { inngest } from "../inngest/index.js";
import employeeModel from "../models/employeeModel.js";
import leaveApplicationModel from "../models/leaveApplicationModel.js";

// Create Leave
// POST /api/leaves

async function createLeave(req, res) {
  try {
    const session = req.session;

    // Find employee using logged-in user's ID
    const employee = await employeeModel.findOne({
      userId: session.userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    // Do not allow deleted/deactivated employees to apply for leave
    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot apply for leave",
      });
    }

    const { type, startDate, endDate, reason } = req.body;

    // Validate required fields
    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }

    // Convert dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate date format
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        error: "Invalid leave dates",
      });
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Leave dates must be in the future
    if (start <= today || end <= today) {
      return res.status(400).json({
        error: "Leave dates must be in the future",
      });
    }

    // End date cannot be before start date
    if (end < start) {
      return res.status(400).json({
        error: "End Date cannot be before start date",
      });
    }

    // Create leave application
    const leave = await leaveApplicationModel.create({
      employeeId: employee._id,
      type,
      startDate: start,
      endDate: end,
      reason,
      status: "PENDING",
    });

    // Send event to Inngest for pending-leave processing
    await inngest.send({
      name: "leave/pending",
      data: {
        leaveApplicationId: leave._id,
      },
    });

    return res.json({
      success: true,
      data: leave,
    });
  } catch (err) {
    console.error("Create Leave Error:", err);

    return res.status(500).json({
      error: "Failed to create Leave",
    });
  }
}

// Get Leaves
// GET /api/leaves
async function getLeave(req, res) {
  try {
    const session = req.session;

    // Check whether logged-in user is admin
    const isAdmin = session.role === "ADMIN";

    // ADMIN

    if (isAdmin) {
      const status = req.query.status;

      // If status is provided, filter by status
      const where = status ? { status } : {};

      const leaves = await leaveApplicationModel
        .find(where)
        .populate(
          "employeeId",
          "firstName lastName email phone position department employmentStatus",
        )
        .sort({ createdAt: -1 });

      const data = leaves.map((ele) => {
        const obj = ele.toObject();

        return {
          ...obj,
          id: obj._id.toString(),

          // Keep employee object separately
          employee: obj.employeeId,

          // Convert employee ID to string
          employeeId: obj.employeeId?._id
            ? obj.employeeId._id.toString()
            : null,
        };
      });

      return res.json({
        data,
      });
    }

    // EMPLOYEE

    const employee = await employeeModel
      .findOne({
        userId: session.userId,
      })
      .lean();

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    // Deleted employee cannot access leave data
    if (employee.isDeleted) {
      return res.status(403).json({
        error:
          "Your account is deactivated. You cannot access leave information",
      });
    }

    // Get only the logged-in employee's leaves
    const leaves = await leaveApplicationModel
      .find({
        employeeId: employee._id,
      })
      .sort({ createdAt: -1 });

    return res.json({
      data: leaves,
      employee: {
        ...employee,
        id: employee._id.toString(),
      },
    });
  } catch (err) {
    console.error("Get Leave Error:", err);

    return res.status(500).json({
      error: "Failed to get Leave",
    });
  }
}

// Update Leave Status
// PATCH /api/leaves/:id

async function updateLeave(req, res) {
  try {
    // Only ADMIN should be able to approve/reject leaves
    if (req.session.role !== "ADMIN") {
      return res.status(403).json({
        error: "Only admin can update leave status",
      });
    }

    const { status } = req.body;

    // Validate status
    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return res.status(400).json({
        error: "Invalid Status",
      });
    }

    // Find leave first
    const leave = await leaveApplicationModel.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        error: "Leave application not found",
      });
    }

    // Update leave status
    leave.status = status;

    await leave.save();

    return res.json({
      success: true,
      data: leave,
    });
  } catch (err) {
    console.error("Update Leave Error:", err);

    return res.status(500).json({
      error: "Failed to update Leave",
    });
  }
}

export { createLeave, getLeave, updateLeave };
