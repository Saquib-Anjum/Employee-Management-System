//Get Profile

import employeeModel from "../models/employeeModel.js";

//Get/api/profile
async function getProfile(req, res) {
//console.log("GET PROFILE FOR SETTING API IS HITTED")
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
 // console.log("UPDATE PROFILE HIT");

  try {
    const session = req.session;

    if (!session?.userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const employee = await employeeModel.findOne({
      userId: session.userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    if (employee.isDeleted) {
      return res.status(403).json({
        error:
          "Your account is deactivated. You cannot update your profile.",
      });
    }

    const { bio } = req.body;

    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      employee._id,
      {
        bio: bio || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    //console.log("PROFILE UPDATED:", updatedEmployee.bio);

    // IMPORTANT: Send response to frontend
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedEmployee,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);

    return res.status(500).json({
      error: "Failed to update profile",
      message: err.message,
    });
  }
}



export { getProfile, updateProfile };
