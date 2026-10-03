import { Loader2, LogInIcon, LogOutIcon } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

function CheckInButton({ todayRecords, onAction }) {
  const [loading, setLoading] = useState(false);

  const handleAttendance = async () => {
    setLoading(true);

    try {
      await api.post("/attendance");

      toast.success(
        todayRecords?.checkIn
          ? "Checked out successfully"
          : "Checked in successfully",
      );

      onAction?.();
    } catch (err) {
      console.error("Attendance error:", err);

      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // Work day completed
  if (todayRecords?.checkOut) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">Work Day Completed</h3>

        <p className="text-slate-500 text-sm mt-1">
          Great Job! See you tomorrow
        </p>
      </div>
    );
  }

  const isCheckedIn = !!todayRecords?.checkIn;

  return (
    <div className="absolute bottom-4 right-4 flex flex-col z-10">
      <button
        type="button"
        onClick={handleAttendance}
        disabled={loading}
        className={`w-full max-w-xs flex justify-between items-center gap-8 p-4 rounded-xl bg-gradient-to-br text-white transition-all disabled:opacity-70 ${
          isCheckedIn
            ? "from-slate-700 to-slate-900"
            : "from-green-600 to-green-700"
        }`}
      >
        {loading ? (
          <Loader2 className="size-7 animate-spin" />
        ) : isCheckedIn ? (
          <LogOutIcon className="size-7" />
        ) : (
          <LogInIcon className="size-7" />
        )}

        <div>
          <h2 className="text-lg font-medium mb-1">
            {loading ? "Processing..." : isCheckedIn ? "Clock Out" : "Clock In"}
          </h2>

          <p className="text-xs opacity-80">
            {isCheckedIn ? "Click to end your shift" : "Start your work day"}
          </p>
        </div>
      </button>
    </div>
  );
}

export default CheckInButton;
