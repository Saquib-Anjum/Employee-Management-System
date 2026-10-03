import {
  PlusCircle,
  X,
  FileTextIcon,
  CalendarArrowDownIcon,
  CalendarCog,
  Send,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

function GeneratePayslipsForm({ employees, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const data = Object.fromEntries(formData.entries());

      console.log("Payslip data:", data);

      await api.post("/payslips", data);

      toast.success("Payslip generated successfully");

      setIsOpen(false);

      onSuccess?.();
    } catch (err) {
      console.error("Create payslip error:", err);

      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to generate payslip",
      );
    } finally {
      setLoading(false);
    }
  };

  // Open button
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn-primary flex items-center gap-2"
      >
        <PlusCircle className="w-4 h-4" />
        Generate Payslip
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={() => !loading && setIsOpen(false)}
    >
      <div
        className="card max-w-lg w-full p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3>Generate Monthly Payslip</h3>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Employee */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <FileTextIcon className="w-4 h-4 text-slate-400" />
              Employee
            </label>

            <select name="employeeId" required className="w-full">
              <option value="">Select Employee</option>

              {employees.map((employee) => (
                <option
                  key={employee.id || employee._id}
                  value={employee.id || employee._id}
                >
                  {employee.firstName} {employee.lastName}
                  {employee.position ? ` - ${employee.position}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Month & Year */}
          <div className="grid grid-cols-2 gap-4">
            {/* Month */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <CalendarArrowDownIcon className="w-4 h-4 text-slate-400" />
                Month
              </label>

              <select
                name="month"
                required
                defaultValue={new Date().getMonth() + 1}
                className="w-full"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <CalendarCog className="w-4 h-4 text-slate-400" />
                Year
              </label>

              <input
                type="number"
                name="year"
                required
                defaultValue={new Date().getFullYear()}
                className="w-full"
              />
            </div>
          </div>

          {/* Basic Salary */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Basic Salary
            </label>

            <input
              type="number"
              name="basicSalary"
              required
              min="0"
              placeholder="50000"
              className="w-full"
            />
          </div>

          {/* Allowances & Deductions */}
          <div className="grid grid-cols-2 gap-4">
            {/* Allowances */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Allowances
              </label>

              <input
                type="number"
                name="allowances"
                required
                min="0"
                defaultValue="0"
                className="w-full"
              />
            </div>

            {/* Deductions */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deductions
              </label>

              <input
                type="number"
                name="deductions"
                required
                min="0"
                defaultValue="0"
                className="w-full"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}

              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GeneratePayslipsForm;
