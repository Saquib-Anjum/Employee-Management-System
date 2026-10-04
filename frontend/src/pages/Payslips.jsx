import React, { useCallback, useEffect, useState } from "react";
import Loading from "../components/Loading";
import PayslipList from "../components/payslips/PayslipList";
import GeneratePayslipsForm from "../components/payslips/GeneratePayslipsForm";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";

function Payslips() {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  // Fetch payslips
  const fetchPayslips = useCallback(async () => {
    try {
      const res = await api.get("/payslips");

      //console.log("Payslips response:", res.data);

      setPayslips(res.data?.data || []);
    } catch (err) {
      console.error("Fetch payslips error:", err);

      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch payslips"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch employees for admin
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get("/employees");

     // console.log("Employees response:", res.data);

      // Backend returns { result: [...] }
      const employeeList = res.data?.result || [];

      // Remove deleted employees
      setEmployees(
        employeeList.filter(
          (employee) => employee.isDeleted !== true
        )
      );
    } catch (err) {
      console.error("Fetch employees error:", err);

      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch employees"
      );

      setEmployees([]);
    }
  }, []);

  // Initial data
  useEffect(() => {
    fetchPayslips();

    if (isAdmin) {
      fetchEmployees();
    }
  }, [isAdmin, fetchPayslips, fetchEmployees]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Payslips</h1>

          <p className="page-subtitle">
            {isAdmin
              ? "Generate and manage employee payslips"
              : "Your payslip history"}
          </p>
        </div>

        {isAdmin && (
          <GeneratePayslipsForm
            employees={employees}
            onSuccess={fetchPayslips}
          />
        )}
      </div>

      {/* Payslip List */}
      <PayslipList
        payslips={payslips}
        isAdmin={isAdmin}
      />
    </div>
  );
}

export default Payslips;