import React, { useEffect, useState } from "react";
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from "../assets/assets";
import Loading from "../components/Loading";
import EmployeeDashboard from "../components/EmployeeDashboard";
import AdminDashboard from "../components/AdminDashboard";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDashboardData(dummyAdminDashboardData);
    //setDashboardData(dummyEmployeeDashboardData)
    setTimeout(() => {
      setLoading(false);
    }, 900);
  }, []);

  if (loading) return (<Loading/>);
  if (!dashboardData) return <p className="text-slate-400 text-center">Faliled to load data </p>;

  if (dashboardData.role === "ADMIN") {
    return <AdminDashboard dashboardData={dashboardData}/>;
  } else {
    return <EmployeeDashboard dashboardData={dashboardData}/>;
  }
};

export default Dashboard;
