import { Loader2, LogInIcon, LogOutIcon } from "lucide-react";
import React, { useState } from "react";

function CheckInButton({ todayRecords, onAtion }) {
  const [loading, setLoading] = useState(false);
  const handleAttendance = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAtion();
    }, 1000);
  };
  if (todayRecords?.checkOut) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className=" text-lg font-bold text-slate-900">
          Work Day Completed
        </h3>
        <p className="text-slate-500 text-sm-mt-1">
          Great Job! See you tommorow
        </p>
      </div>
    );
  }
  const isCheckedIn = !!todayRecords?.isCheckedIn;

  return (
    <div className="absolute bottom-4 right-4 flex-col flex z-1">
      <button
      onClick={handleAttendance}
      disabled={loading}
      className={`w-full max-w-xs flex justify-between items-center gap-8 p-4 rounded-xl bg-linear-to-br text-white ${isCheckedIn?'from-slate-700 to-slate-900':'from-green-600 to-green-700'}`}>
        {loading ? (
          <Loader2 className="size-7 animate-spin" />
        ) : isCheckedIn ? (
          <LogOutIcon className="size-7" />
        ) : (
          <LogInIcon className="size-7" />
        )}
        <div className="">
          <h2 className="text-lg-font-medium mb-1">
            {loading ? "Processing" : isCheckedIn ? "Clock Out" : "Clock"}
          </h2>
          <p className="text-xs opacity-80">
            {isCheckedIn ? "Click to end you shift" : "start your work day"}
          </p>
        </div>
      </button>
    </div>
  );
}

export default CheckInButton;
