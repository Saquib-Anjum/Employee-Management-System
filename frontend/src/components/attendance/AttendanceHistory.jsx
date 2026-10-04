import React from "react";
import {
  getDayTypeDisplay,
  getWorkingHoursDisplay,
} from "../../assets/assets";
import { format } from "date-fns";

function AttendanceHistory({ history }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-slate-900 text-sm font-semibold">
          Recent Activity
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="table-modern">
          <thead>
            <tr>
              <th className="px-6 py-6">Date</th>
              <th className="px-6 py-6">Check In</th>
              <th className="px-6 py-6">Check Out</th>
              <th className="px-6 py-6">Working Hours</th>
              <th className="px-6 py-6">Day Type</th>
              <th className="px-6 py-6">Status</th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-slate-400"
                >
                  No records found
                </td>
              </tr>
            ) : (
              history.map((ele) => {
                const dayType = getDayTypeDisplay(ele);

                return (
                  <tr key={ele._id} className="">
                    {/* Date */}
                    <td className="text-slate-600 px-6 py-6">
                      {ele.date
                        ? format(
                            new Date(ele.date),
                            "MMM dd, yyyy"
                          )
                        : "-"}
                    </td>

                    {/* Check In */}
                    <td className="text-slate-600 px-6 py-6">
                      {ele.checkIn
                        ? format(
                            new Date(ele.checkIn),
                            "hh:mm a"
                          )
                        : "-"}
                    </td>

                    {/* Check Out */}
                    <td className="text-slate-600 px-6 py-6">
                      {ele.checkOut
                        ? format(
                            new Date(ele.checkOut),
                            "hh:mm a"
                          )
                        : "-"}
                    </td>

                    {/* Working Hours */}
                    <td className="font-medium text-slate-600 px-6 py-6">
                      {getWorkingHoursDisplay(ele)}
                    </td>

                    {/* Day Type */}
                    <td className="px-6 py-6">
                      {dayType.label !== "-" ? (
                        <span
                          className={`badge ${dayType.className}`}
                        >
                          {dayType.label}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-6">
                      <span
                        className={`badge ${
                          ele.status === "PRESENT"
                            ? "badge-success"
                            : ele.status === "LATE"
                            ? "badge-warning"
                            : "badge-danger"
                        }`}
                      >
                        {ele.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceHistory;