import bcrypt from "bcrypt";
import employeeModel from "../models/employeeModel.js";
import userModel from "../models/userModel.js";

// ======================================================
// GET ALL EMPLOYEES
// GET /api/employees

export const getEmployees = async (req, res) => {
  try {
    const { department } = req.query;

    const where = {};

    if (department) {
      where.department = department;
    }

    const employees = await employeeModel
      .find(where)
      .populate("userId", "email role")
      .sort({ createdAt: -1 })
      .lean();

    const result = employees.map((emp) => ({
      ...emp,
      id: emp._id.toString(),

      user: emp.userId
        ? {
            email: emp.userId.email,
            role: emp.userId.role,
          }
        : null,
    }));

    return res.json({
      result,
    });
  } catch (err) {
    console.log("Get Employees Error:", err.message);

    return res.status(500).json({
      error: "Failed to fetch employees",
    });
  }
};

// ======================================================
// CREATE EMPLOYEE
// POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      joinDate,
      password,
      role,
      bio,
      employmentStatus,
    } = req.body;

    // Required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await userModel.create({
      email,
      password: hashedPassword,
      role: role || "EMPLOYEE",
    });

    try {
      // Create Employee
      const employee = await employeeModel.create({
        userId: user._id,

        firstName,
        lastName,
        email,
        phone,
        position,

        department: department || "Engineering",

        basicSalary: Number(basicSalary) || 0,
        allowances: Number(allowances) || 0,
        deductions: Number(deductions) || 0,

        joinDate: joinDate ? new Date(joinDate) : new Date(),

        employmentStatus: employmentStatus || "ACTIVE",

        bio: bio || "",
      });

      return res.status(201).json({
        success: true,
        employee,
      });
    } catch (employeeError) {
      // If employee creation fails,
      // remove the user that was already created.
      await userModel.findByIdAndDelete(user._id);

      throw employeeError;
    }
  } catch (err) {
    console.log("Create Employee Error:", err.message);

    if (err.code === 11000) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    return res.status(500).json({
      error: "Failed to create employee",
    });
  }
};

// ======================================================
// UPDATE EMPLOYEE
// PUT /api/employees/:id

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      joinDate,
      password,
      role,
      bio,
      employmentStatus,
    } = req.body;

    // Find employee
    const employee = await employeeModel.findById(id);

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    // ------------------------------------------
    // Update Employee fields
  

    if (firstName !== undefined) {
      employee.firstName = firstName;
    }

    if (lastName !== undefined) {
      employee.lastName = lastName;
    }

    if (email !== undefined) {
      employee.email = email;
    }

    if (phone !== undefined) {
      employee.phone = phone;
    }

    if (position !== undefined) {
      employee.position = position;
    }

    if (department !== undefined) {
      employee.department = department;
    }

    if (basicSalary !== undefined) {
      employee.basicSalary = Number(basicSalary) || 0;
    }

    if (allowances !== undefined) {
      employee.allowances = Number(allowances) || 0;
    }

    if (deductions !== undefined) {
      employee.deductions = Number(deductions) || 0;
    }

    if (joinDate !== undefined) {
      employee.joinDate = new Date(joinDate);
    }

    if (bio !== undefined) {
      employee.bio = bio;
    }

    if (employmentStatus !== undefined) {
      employee.employmentStatus = employmentStatus;
    }

    await employee.save();

    // ------------------------------------------
    // Update User


    const userUpdate = {};

    if (email !== undefined) {
      userUpdate.email = email;
    }

    if (role !== undefined) {
      userUpdate.role = role;
    }

    // Only hash password if new password is provided
    if (password) {
      userUpdate.password = await bcrypt.hash(password, 10);
    }

    // Only update user if there is something to update
    if (Object.keys(userUpdate).length > 0) {
      await userModel.findByIdAndUpdate(employee.userId, userUpdate, {
        new: true,
        runValidators: true,
      });
    }

    return res.json({
      success: true,
      employee,
    });
  } catch (err) {
    console.log("Update Employee Error:", err.message);

    if (err.code === 11000) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    return res.status(500).json({
      error: "Failed to update employee",
    });
  }
};

// ======================================================
// DELETE EMPLOYEE
// DELETE /api/employees/:id
// ======================================================
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Find employee
    const employee = await employeeModel.findById(id);

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    // Soft delete
    employee.isDeleted = true;
    employee.employmentStatus = "INACTIVE";

    await employee.save();

    return res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    console.log("Delete Employee Error:", err.message);

    return res.status(500).json({
      error: "Failed to delete employee",
    });
  }
};
