import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { format } from "date-fns";
import { Printer } from "lucide-react";
import api from "../api/axios";

function PrintPaySlips() {
  const { id } = useParams();

  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        const res = await api.get(`/payslips/${id}`);

       // console.log("Payslip response:", res.data);

        // Backend returns { data: result }
        setPayslip(res.data?.data || null);
      } catch (err) {
        console.error("Fetch payslip error:", err);
        setPayslip(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPayslip();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!payslip) {
    return (
      <p className="text-center text-slate-400 py-12">Payslip not found</p>
    );
  }

  const formattedPeriod = format(
    new Date(payslip.year, payslip.month - 1),
    "MMMM yyyy",
  );

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white animate-fade-in">
      {/* Header */}
      <div className="text-center border-b border-slate-200 pb-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          PAYSLIP
        </h1>

        <p className="text-slate-500 text-sm mt-1">{formattedPeriod}</p>
      </div>

      {/* Employee Information */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Employee Name */}
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Employee Name
          </p>

          <p className="font-semibold text-slate-900">
            {payslip.employee?.firstName || "-"}{" "}
            {payslip.employee?.lastName || ""}
          </p>
        </div>

        {/* Position */}
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Position
          </p>

          <p className="font-semibold text-slate-900">
            {payslip.employee?.position || "-"}
          </p>
        </div>

        {/* Email */}
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Email
          </p>

          <p className="font-semibold text-slate-900">
            {payslip.employee?.email || "-"}
          </p>
        </div>

        {/* Period */}
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Period
          </p>

          <p className="font-semibold text-slate-900">{formattedPeriod}</p>
        </div>
      </div>

      {/* Salary Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">
                Description
              </th>

              <th className="text-right py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Basic Salary */}
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 text-slate-700">Basic Salary</td>

              <td className="py-3 px-4 text-slate-700 text-right">
                ₹{Number(payslip.basicSalary || 0).toLocaleString("en-IN")}
              </td>
            </tr>

            {/* Allowances */}
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 text-slate-700">Allowances</td>

              <td className="py-3 px-4 text-slate-700 text-right">
                + ₹{Number(payslip.allowances || 0).toLocaleString("en-IN")}
              </td>
            </tr>

            {/* Deductions */}
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 text-slate-700">Deductions</td>

              <td className="py-3 px-4 text-slate-700 text-right">
                - ₹{Number(payslip.deductions || 0).toLocaleString("en-IN")}
              </td>
            </tr>

            {/* Net Salary */}
            <tr className="border-t-2 border-slate-300 bg-slate-50">
              <td className="py-3 px-4 text-slate-900 font-semibold">
                Net Salary
              </td>

              <td className="py-4 px-4 text-slate-900 font-bold text-lg text-right">
                ₹{Number(payslip.netSalary || 0).toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Print Button */}
      <button
        type="button"
        onClick={() => window.print()}
        className="btn-primary print:hidden flex items-center justify-center gap-2"
      >
        <Printer className="w-4 h-4 text-slate-50" />
        Print Payslip
      </button>
    </div>
  );
}

export default PrintPaySlips;
