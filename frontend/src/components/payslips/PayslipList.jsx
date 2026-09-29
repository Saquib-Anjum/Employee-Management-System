import { format } from "date-fns";
import { Download } from "lucide-react";
import React,{useState} from "react";

function PayslipList({payslips,isAdmin}) {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">Payslip History</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-modern w-full">
          <thead>
            <tr>
              {isAdmin && <th className="px-6 py-6 text-left">Employee</th>}

              <th className="px-6 py-6 text-left">Period</th>

              <th className="px-6 py-6 text-left">Basic Salary</th>

              <th className="px-6 py-6 text-left">Net Salary</th>

              {/* <th className="px-6 py-6 text-left">Status</th> */}

              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {payslips.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 5 : 4}
                  className="text-center py-12 text-slate-400"
                >
                  No Payslip found.
                </td>
              </tr>
            ) : (
              payslips.map((ele, idx) => {
                const payslipId = ele.id || ele._id;

                return (
                  <tr key={payslipId || idx}>
                    {/* Employee */}
                    {isAdmin && (
                      <td className="px-6 py-6 text-slate-900">
                        {ele.employee?.firstName || ""}{" "}
                        {ele.employee?.lastName || ""}
                      </td>
                    )}

                    {/*Period  */}
                    <td className="px-6 py-6 text-slate-500">
                     
                        {format(new Date(ele.year, ele.month-1), 'MMMM yyyy')}
                      
                    </td>

                    {/* Basic Salary */}
                    <td className=" text-slate-500 ">
                      ₹{ele.basicSalary}
                    </td>

                    {/* Net Salary */}
                     <td className=" text-slate-800 font-medium">
                      ₹{ele.netSalary}
                    </td>

                    {/* Status
                    <td className="">
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
                    </td> */}

                    {/* Actions */}
                   
                      <td className="text-center">
                       <button
                       onClick={()=>window.open(`/print/payslips/${ele.id ||ele._id}`)}
                       className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors ring-1 ring-blue-600/10" >
                        <Download className=" w-5 h-5"/>
                       </button>
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

export default PayslipList;
