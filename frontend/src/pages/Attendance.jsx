import React, { useCallback, useEffect, useState } from "react";
import Loading from "../components/Loading";
import CheckInButton from "../components/attendance/CheckInButton";
import AttendanceStats from "../components/attendance/AttendanceStats";
import AttendanceHistory from "../components/attendance/AttendanceHistory";
import api from "../api/axios.js";
import { toast } from "react-hot-toast";

const Attendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/attendance");

      const json = response.data;

    //  console.log("Attendance response:", json);

      setHistory(json?.data || []);

      setIsDeleted(json?.employee?.isDeleted === true);
    } catch (err) {
      console.error("Attendance fetch error:", err);

      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch attendance",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Loading />;
  }

  const today = new Date();

  // Find today's attendance record
  const todayRecord = history.find((record) => {
    if (!record?.date) return false;

    const recordDate = new Date(record.date);

    return recordDate.toDateString() === today.toDateString();
  });

  //console.log("Today's record:", todayRecord);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>

        <p className="page-subtitle">Track your work hours properly.</p>
      </div>

      {/* Employee Deleted */}
      {isDeleted ? (
        <div className="mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-700">
          You can no longer clock in or out because your employee record has
          been marked as deleted.
        </div>
      ) : (
        <div className="mb-8">
          <CheckInButton todayRecords={todayRecord} onAction={fetchData} />
        </div>
      )}

      {/* Attendance Stats */}
      <AttendanceStats history={history} />

      {/* Attendance History */}
      <AttendanceHistory history={history} />
    </div>
  );
};

export default Attendance;
