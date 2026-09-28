import React, { useCallback, useEffect, useState } from "react";
import { DEPARTMENTS, dummyEmployeeData } from "../assets/assets";
import { BriefcasePlus, PlusIcon, SearchIcon, X } from "lucide-react";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeFrom from "../components/EmployeeFrom";

function Employees() {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectDepartment, setSelectDepartment] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);


  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setEmployeeData(
      dummyEmployeeData.filter((ele) => selectDepartment ? ele.department === selectDepartment : ele ));
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [selectDepartment]);
  const filtered = employeeData.filter((emp, idx) =>
    `${emp.firstName} ${emp.lastName} ${emp.position}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  console.log(selectDepartment,"selected department");
  console.log(employeeData,"selected Employee");
  return (
    <div className="animate-fade-in">
      {/* ---Header section--- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="">
          <p className="page-title">Employees</p>
          <p className="page-subtitle">Manage your team members</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <PlusIcon className="" size={16} />
          Add Employee
        </button>
      </div>
      {/* --search bar --- */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="w-full pl-10"
            placeholder="Search Employees........"
          />
        </div>
        <select
          name="departments"
          
          value={selectDepartment}
          onChange={(e) => setSelectDepartment(e.target.value)}
          className="max-w-40"
        >
          <option value="">{"  "}All Departments</option>
          {DEPARTMENTS.map((ele, idx) => {
            return (
              <option key={idx} value={ele}>
                {ele}
              </option>
            );
          })}
        </select>
      </div>

      {/* emp cards */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full "></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.length === 0 ? (
            <>
              <p className="col-span-full text-cetner py-16 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                No Employee found
              </p>
            </>
          ) : (
            filtered.map((emp, idx) => (
              <EmployeeCard
                key={idx}
                employee={emp}
                onDelete={fetchEmployees}
                onEdit={(e) => setEditEmployee(e)}
              />
            ))
          )}
        </div>
      )}
      {/* create employee modal */}
      {showCreateModal && (
        <div
          className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-sart justify-center p-4 overflow-y-auto"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="inset-0" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in  overflow-y-auto  "
            onClick={(e) => e.stopPropagation()}
          >
            {/* top part kind of heading */}
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Add New Employee
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Create a user account and employee profile
                </p>
              </div>
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                <X
                  className="w-6 h-6"
                  onClick={() => setShowCreateModal(false)}
                />
              </button>
            </div>
            {/* bottom part kind of form */}
            <div className="p-6">
              <EmployeeFrom
                onSuccess={() => {
                  setShowCreateModal(false);
                  fetchEmployees();
                }}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        </div>
      )}
      {/* edit employee model */}
      {editEmployee && (
        <div
          className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-sart justify-center p-4 "
          onClick={() => setEditEmployee(null)}
        >
          <div className="inset-0" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl h-full w-full max-w-3xl my-8 animate-fade-in overflow-y-auto "
            onClick={(e) => e.stopPropagation()}
          >
            {/* top part kind of heading */}
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Edit Employee{" "}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Update Employee details
                </p>
              </div>
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" onClick={() => setEditEmployee(false)} />
              </button>
            </div>
            {/* bottom part kind of form */}
            <div className="p-6 ">
              <EmployeeFrom
                initialData={editEmployee}
                onSuccess={() => {
                  setEditEmployee(null);
                  fetchEmployees();
                }}
                onCancel={() => setEditEmployee(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
