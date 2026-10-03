import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEPARTMENTS } from "../assets/assets";
import { Loader } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const EmployeeFrom = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (isEditMode) {
      const password = formData.get("password");
      if (!password) {
        formData.delete("password");
      }
    }

    try {
      const url = isEditMode ? `/employees/${initialData.id}` : "/employees";
      const method = isEditMode ? "put" : "post";
      await api[method](url, formData);
      onSuccess ? onSuccess() : navigate("/employees");
    } catch (err) {
      console.log(err)
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  //console.log(initialData, "initialData");
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl animate-fade-in"
    >
      {/* personal info */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="" className="block mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              required
              defaultValue={initialData?.firstName}
            />
          </div>

          <div>
            <label htmlFor="" className="block mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              required
              defaultValue={initialData?.lastName}
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              required
              defaultValue={initialData?.phone}
            />
          </div>

          <div>
            <label htmlFor="" className="block mb-2">
              Join Date
            </label>
            <input
              type="date"
              name="joinDate"
              required
              defaultValue={
                initialData?.joinDate
                  ? new Date(initialData.joinDate).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="" className="block mb-2">
              Bio (Optopnal)
            </label>
            <textarea
              name="bio"
              defaultValue={initialData?.bio}
              className="resize-none "
              placeholder="Berif description...."
            />
          </div>
        </div>
      </div>
      {/* Employment Details  */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Employemnt Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="department" className="block mb-2">
              Department
            </label>
            <select
              name="department"
              required
              defaultValue={initialData?.department || ""}
            >
              <option value=""> Select Department</option>
              {DEPARTMENTS.map((ele, idx) => (
                <option key={idx}>{ele}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Position
            </label>
            <input
              type="text"
              name="position"
              required
              defaultValue={initialData?.position}
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Basic Salary
            </label>
            <input
              type="number"
              name="basicSalary"
              required
              min="0"
              step="0.01"
              defaultValue={initialData?.basicSalary || 0}
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Allowances
            </label>
            <input
              type="number"
              name="allowances"
              required
              min="0"
              step="0.01"
              defaultValue={initialData?.allowances || 0}
            />
          </div>

          <div>
            <label htmlFor="" className="block mb-2">
              Deductions
            </label>
            <input
              type="number"
              name="deductions"
              required
              min="0"
              step="0.01"
              defaultValue={initialData?.deductions || ""}
            />
          </div>
          {isEditMode && (
            <div>
              <label htmlFor="" className="block mb-2">
                Status
              </label>
              <select
                name="employmentStatus"
                required
                defaultValue={initialData?.employmentStatus}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Account setup */}

      <div className="card p-5 sm:p-6">
        <h3 className=" text-base font-medium mb-6 pb-4 border-b border-slate-100">
          Account Setup
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div className="sm:col-span-3">
            <label htmlFor="" className="block mb-2">
              Work Email
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue={initialData?.email}
            />
          </div>

          {!isEditMode && (
            <div>
              <label htmlFor="" className="block mb-2">
                Temporary Password
              </label>
              <input type="password" name="password" required />
            </div>
          )}

          {isEditMode && (
            <div>
              <label htmlFor="" className="block mb-2">
                Change Password (optional)
              </label>
              <input
                type="password"
                name="password"
                
                placeholder="Leave blank to keep current"
              />
            </div>
          )}
          <div>
            <label htmlFor="" className="block mb-2">
              System Role
            </label>
            <select
              name="role"
              defaultValue={initialData?.user.role || "EMPLOYEE"}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reversse sm:flex-row justify-end gap-3 pt-2">
        <button
          onClick={() => (onCancel ? onCancel() : navigate(-1))}
          type="button"
          className="btn-secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center justify-center"
        >
          {loading && <Loader className="w-4 h-4 animate-spin mr-2" />}
          {isEditMode ? "Update Employee" : "Create Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeFrom;
