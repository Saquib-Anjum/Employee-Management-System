//Get Profile

import employeeModel from "../models/employeeModel.js";

//Get/api/profile
async function getProfile(req, res) {
  try {
    const session = req.session;
    const employee = await employeeModel.findOne({ userId: session.userId });

    if (!employee) {
      return res.json({
        firstName: "Admin",
        lastName: "",
        email: session.email,
      });
    }
    return res.json(employee);
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch profile",
    });
  }
}
//update profile
// PUT : /api/profile
async function updateProfile(req, res) {
  try {
    const session = req.session;
    const employee = await employeeModel.findOne({ userId: session.userId });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not Found",
      });
    }
    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot update your profile.",
      });
    }
    await employeeModel.findByIdAndUpdate(employee._id, {
      bio: req.body.bio,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch profile",
    });
  }
}

export { getProfile, updateProfile };
