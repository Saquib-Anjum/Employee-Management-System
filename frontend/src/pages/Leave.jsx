import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { dummyLeaveData } from "../assets/assets.jsx";
import Loading from "../components/Loading.jsx";
import {
  PalmtreeIcon,
  PlusIcon,
  ThermometerSnowflake,
  UmbrellaIcon,
} from "lucide-react";
import LeaveHistory from "../components/Leave/LeaveHistory.jsx";
function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const isAdmin = false;

  const fetchLeaves = useCallback(() => {
    setLeaves(dummyLeaveData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);
  if (loading) return <Loading />;

  const approvedLeaves = leaves.filter((ele) => ele.status === "APPROVED");
  const sickCount = approvedLeaves.filter((ele) => ele.type === "SICK").length;
  const casualCount = approvedLeaves.filter(
    (ele) => ele.type === "CASUAL",
  ).length;
  const annualCount = approvedLeaves.filter(
    (ele) => ele.type === "ANNUAL",
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="">
          <h1>Leave Management</h1>
          <p>
            {isAdmin
              ? "Manage leave application"
              : "Your Leave History and requests"}
          </p>
        </div>
        {!isAdmin && !isDeleted && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <PlusIcon className="w-4 h-4" /> Apply for Leave
          </button>
        )}
      </div>
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mbb-8">
          {stats.map((ele, idx) => (
            <div
              key={idx}
              className="card card-hover p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70"/>

              <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200">
                <ele.icon className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transiton-colors duration-200" />
              </div>
              <div className="">
                <p className="text-sm text-slate-500">{ele.label}</p>
                <p className="text-2xl font-medium text-slate-900 tracking-tight">
                  {ele.value} <span className="text-xs text-slate-500">taken</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves}/>
    </div>
  );
}

export default Leave;
