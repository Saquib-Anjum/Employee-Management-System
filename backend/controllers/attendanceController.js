import attendanceModel from "../models/attendanceModel.js";
import employeeModel from "../models/employeeModel.js";
//Clock in/out for employees
// post /api/addtendace
async function checkInOut(req, res) {
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
        error: "Your account is deactivated. You cannot clock in/out",
      });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await attendanceModel.findOne({
      employeeId: employee._id,
      date: today,
    });
    const now = new Date();
    if (!existing) {
      const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
      const attendance = await attendanceModel.create({
        employeeId: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? "LATE" : "PRESENT",
      });
      return res.json({
        success: true,
        type: "CHECK_IN",
      });
    } else if (!existing.checkOut) {
      const checkInTime = new Date(existing.checkIn).getTime();
      const diffMs = now.getTime() - checkInTime;
      const diffHours = diffMs / (1000 * 60 * 60);
      //computing working hours and half day
      const workingHours = parseFloat(diffHours.toFixed(2));
      let dayType = "Half Day";
      if (workingHours >= 8) dayType = "Full Day";
      else if (workingHours >= 6) dayType = "Three Quarter Day";
      else if (workingHours >= 4) dayType = "Half Day";
      else dayType = "Short Day";
      existing.workingHours = workingHours;
      existing.dayType = dayType;
      await existing.save();
      return res.json({
        success: true,
        type: "CHECK_OUT",
        data: existing,
      });
    } else {
      return res.json({
        success: true,
        type: "CHECK_OUT",
        data: existing,
      });
    }
  } catch (err) {
    console.error(err, "Error");
    return res.status(500).json({
      error: "Failed Operation",
    });
  }
}

//get attendance for employee
// GET /api/attendance
async function getAttendance(req, res) {
  try {
    const session = req.session;
    const employee = await employeeModel.findOne({ userId: session.userId });
    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const limit = parseInt(req.query.limit || 30);
    const history = await attendanceModel
      .find({ employeeId: employee._id })
      .sort({ date: -1 })
      .limit(limit);
    return res.json({
      data: history,
      employee: { isDeleted: employee.isDeleted },
    });
  } catch (err) {
    console.error(err, "Error");
    return res.status(500).json({
      error: "Failed to get attendance",
    });
  }
}

export { checkInOut, getAttendance };
