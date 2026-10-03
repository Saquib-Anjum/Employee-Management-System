import React, { useState } from "react";
import { format } from "date-fns";
import { CheckIcon, Loader, X } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

function LeaveHistory({ leaves = [], isAdmin, onUpdate }) {
  const [processing, setProcessing] = useState(null);

  const handleStatusUpdate = async (id, status) => {
    setProcessing(id);

    try {
      await api.patch(`/leave/${id}`,{status});
      // if (onUpdate) {
      //   await onUpdate(id, status);
      // }
    } catch (error) {
      toast.error(err?.response?.data?.error||err.message);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">
          Leave History
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-modern w-full">
          <thead>
            <tr>
              {isAdmin && (
                <th className="px-6 py-6 text-left">
                  Employee
                </th>
              )}

              <th className="px-6 py-6 text-left">
                Type
              </th>

              <th className="px-6 py-6 text-left">
                Dates
              </th>

              <th className="px-6 py-6 text-left">
                Reason
              </th>

              <th className="px-6 py-6 text-left">
                Status
              </th>

             

              {isAdmin && (
                <th className="px-6 py-6 text-center">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 7 : 5}
                  className="text-center py-12 text-slate-400"
                >
                  No Leave Application Found.
                </td>
              </tr>
            ) : (
              leaves.map((ele, idx) => {
                const leaveId = ele.id || ele._id;

                return (
                  <tr key={leaveId || idx}>
                    {/* Employee */}
                    {isAdmin && (
                      <td className="px-6 py-6 text-slate-900">
                        {ele.employee?.firstName || ""}{" "}
                        {ele.employee?.lastName || ""}
                      </td>
                    )}

                    {/* Type */}
                    <td className="px-6 py-6">
                      <span className="badge bg-slate-100 text-slate-600">
                        {ele.type}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="px-6 py-6 text-xs text-slate-500 whitespace-nowrap">
                      {ele.startDate && ele.endDate ? (
                        <>
                          {format(
                            new Date(ele.startDate),
                            "MMM dd"
                          )}
                          {" - "}
                          {format(
                            new Date(ele.endDate),
                            "MMM dd, yyyy"
                          )}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Reason */}
                    <td
                      className="px-6 py-6 max-w-xs truncate text-slate-500"
                      title={ele.reason}
                    >
                      {ele.reason || "-"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-6">
                      <span
                        className={`badge ${
                          ele.status === "APPROVED"
                            ? "badge-success"
                            : ele.status === "REJECTED"
                              ? "badge-danger"
                              : "badge-warning"
                        }`}
                      >
                        {ele.status}
                      </span>
                    </td>

                    
                    {/* Actions */}
                    {isAdmin && (
                      <td className="px-6 py-6">
                        {ele.status === "PENDING" ? (
                          <div className="flex items-center justify-center gap-3">
                            {/* Approve Button */}
                            <button
                              type="button"
                              disabled={!!processing}
                              onClick={() =>
                                handleStatusUpdate(
                                  leaveId,
                                  "APPROVED"
                                )
                              }
                              className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Approve Leave"
                            >
                              {processing === leaveId ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckIcon className="w-4 h-4" />
                              )}
                            </button>

                            {/* Reject Button */}
                            <button
                              type="button"
                              disabled={!!processing}
                              onClick={() =>
                                handleStatusUpdate(
                                  leaveId,
                                  "REJECTED"
                                )
                              }
                              className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Reject Leave"
                            >
                              {processing === leaveId ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No actions
                          </span>
                        )}
                      </td>
                    )}
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

export default LeaveHistory;