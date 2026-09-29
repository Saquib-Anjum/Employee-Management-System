import {
  CalendarCheck2,
  CalendarClockIcon,
  FileTextIcon,
  Loader2,
  Send,
  X,
} from "lucide-react";
import React, { useState } from "react";

function ApplyLeaveModel({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState("");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between p-6 pb-0 ">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Apply for Leave
            </h2>
            <p className="text-sm text-slate-700">
              Submit your leave request for approval
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* leave type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <FileTextIcon className="w-4 h-4 text-slate-400" />
              Leave Type
            </label>
            <select name="type" required className="">
              <option value="">Select Leave Type</option>
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave Type</option>
              <option value="ANNUAL">Annual Leave Type</option>
            </select>
          </div>
          {/* duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <CalendarClockIcon className="w-4 h-4 text-slate-400" />
              Duration
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-slate-400">From</span>
                <input type="date" name="startDate" required min={minDate} />
              </div>
              <div>
                <span className="block text-xs text-slate-400">To</span>
                <input type="date" name="endDate" required min={minDate} />
              </div>
            </div>
          </div>
          {/* reason */}
          <div>
            <label className="flex gap-2 text-sm font-medium text-slate-700 mb-2">
              <FileTextIcon className="w-4 h-4 text-slate-400" />
              Reason
            </label>
            <textarea
              name="reason"
              required
              className="resize-none"
              rows={3}
              placeholder="Briefly describe why you need this leave...."
            ></textarea>
          </div>
          {/* button */}
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>

            <button type="submit" onClick={onSuccess} className="btn-primary  flex-1 flex item-center justify-center gap-2"
            disabled={loading}>
            {loading?<Loader2 className="w-4 h-4 animate-spin"/>:<Send className="w-4 h-4 "/>}
            {loading?"Submitting....":"Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyLeaveModel;
