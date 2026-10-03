import React, { useCallback, useEffect, useState } from "react";
import {
  PalmtreeIcon,
  PlusIcon,
  ThermometerSnowflake,
  UmbrellaIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import Loading from "../components/Loading.jsx";
import LeaveHistory from "../components/Leave/LeaveHistory.jsx";
import ApplyLeaveModel from "../components/Leave/ApplyLeaveModel.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const { user } = useAuth();

  // Make this a real boolean
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/leave");

      // Backend should return { data: [...] }
  
      setLeaves(res.data?.data || []);

      // Fix typo: idDeleted -> isDeleted
      if (res.data?.employee?.isDeleted) {
        setIsDeleted(true);
      } else {
        setIsDeleted(false);
      }
    } catch (err) {
      console.error("Fetch leaves error:", err);

      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch leaves",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  if (loading) {
    return <Loading />;
  }

  const approvedLeaves = leaves.filter((leave) => leave.status === "APPROVED");

  const sickCount = approvedLeaves.filter(
    (leave) => leave.type === "SICK",
  ).length;

  const casualCount = approvedLeaves.filter(
    (leave) => leave.type === "CASUAL",
  ).length;

  const annualCount = approvedLeaves.filter(
    (leave) => leave.type === "ANNUAL",
  ).length;

  const stats = [
    {
      label: "Sick Leave",
      value: sickCount,
      icon: ThermometerSnowflake,
    },
    {
      label: "Casual Leave",
      value: casualCount,
      icon: UmbrellaIcon,
    },
    {
      label: "Annual Leave",
      value: annualCount,
      icon: PalmtreeIcon,
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1>Leave Management</h1>

          <p>
            {isAdmin
              ? "Manage leave applications"
              : "Your leave history and requests"}
          </p>
        </div>

        {/* Employee can apply for leave */}
        {!isAdmin && !isDeleted && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <PlusIcon className="w-4 h-4" />
            Apply for Leave
          </button>
        )}
      </div>

      {/* Employee Leave Statistics */}
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;

            return (
              <div
                key={idx}
                className="card card-hover p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70" />

                <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200">
                  <Icon className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors duration-200" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>

                  <p className="text-2xl font-medium text-slate-900 tracking-tight">
                    {stat.value}{" "}
                    <span className="text-xs text-slate-500">taken</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leave History */}
      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />

      {/* Apply Leave Modal */}
      <ApplyLeaveModel
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchLeaves}
      />
    </div>
  );
}

export default Leave;
