import { PlusCircle, X,FileTextIcon, CalendarArrowDownIcon, CalendarCog, Send } from "lucide-react";
import React, { useState } from "react";

function GeneratePayslipsForm({ employees, onSuccess }) {
  const [isOpen, setIsopen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  // return comp
  if (!isOpen)
    return (
      <button
        onClick={() => setIsopen(true)}
        className="btn-primary flex items-center gap-2"
      >
        <PlusCircle className="w-4 h-4" /> Generate Payslip
      </button>
    );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="card max-w-lg w-full p-6 animate-slide-up">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h3>Generate Monthly Payslip</h3>
          <button
            onClick={() => setIsopen(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-7" />
          </button>
        </div>
        {/* form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Select Employee */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <FileTextIcon className="w-4 h-4 text-slate-400" />
              Employee
            </label>
            <select name="employeeId" required className="">
              <option value="">Select Employee</option>
              {employees.map((ele, idx) => {
                return (
                  <>
                    <option vlaue={ele.id || ele._id}>
                      {ele.firstName} {ele.lastName} {ele.position}
                    </option>
                  </>
                );
              })}
            </select>
          </div>
          {/* Select Month Year */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <CalendarArrowDownIcon className="w-4 h-4 text-slate-400" />
                Month
              </label>
              <select name="month">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
             
            </div>

             <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <CalendarCog className="w-4 h-4 text-slate-400" />
                Year
              </label>
              <input type="number" name="year" defaultValue={new Date().getFullYear()} />
             
            </div>
           
          </div>

          {/* Basic Salary */}
          <div>
            <label className="block  text-sm font-medium text-slate-700 mb-2">
              
              Basic Salary
            </label>
           <input type="number" name="basicSalary" required placeholder="50000" />
          </div>
          {/* allowances */}
          <div className="grid grid-cols-2 gap-4">
{/* 1 */}
 <div>
            <label className="block  text-sm font-medium text-slate-700 mb-2">
              
              Allowances
            </label>
           <input type="number" name="allowances" required defaultValue="0" />
          </div>
          {/* 2 */}
           <div>
            <label className="block  text-sm font-medium text-slate-700 mb-2">
              
              Deductions
            </label>
           <input type="number" name="deductions" required defaultValue="0" />
          </div>
          </div>
          {/* button */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={()=>setIsopen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
             
              className="btn-primary  flex-1 flex item-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 " />
              )}
              {loading ? "Submitting...." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GeneratePayslipsForm;
