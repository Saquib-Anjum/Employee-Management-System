import React from "react";
import LoginLeftSideBar from "../components/LoginLeftSideBar";
import { Link, Navigate } from "react-router-dom";
import { ArrowRightIcon, ShieldIcon, UserIcon } from "lucide-react";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
function LoginLanding() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (user) return <Navigate to="/" replace />;

  const portalOption = [
    {
      to: "/login/admin",
      title: "Admin Portal",
      description:
        "Manage employees,departments,payroll,and system configurations.",
      icon: ShieldIcon,
    },
    {
      to: "/login/employee",
      title: "Employee Portal",
      description:
        "View you profile track attendance,request time off, and access payslips.",
      icon: UserIcon,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSideBar />
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen">
        <div className="w-full max-w-md animate-fade-in z-10">
          {/* Heading */}
          <div>
            <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-3">
              Welcome Back
            </h2>
            <p className="text-slate-500">
              Select your protal to securely access the system.
            </p>
          </div>
          {/* portal list */}
          <div className=" flex flex-col gap-4 mt-2">
            {portalOption.map((ele, idx) => {
              return (
                <Link
                  key={idx}
                  to={ele.to}
                  className="group block bg-slate-50 border border-slate-200 rounded-lg p-5 sm:p-6 transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50"
                >
                  <div className="flex itmes-center justify-between  rounded border-indigo-50 ">
                    <h3 className="text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {ele.title}
                    </h3>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </Link>
              );
            })}
          </div>
          {/* footer............... */}

          <div className="mt-12 text-center md:text-left text-sm text-slate-400">
            <p>@{new Date().getFullYear()} EMS All right reserve</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginLanding;
