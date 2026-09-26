import React from "react";
import LoginLeftSideBar from "./LoginLeftSideBar";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

function LoginForm(props) {
  const {role,titel,subtitle} =props;
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSideBar />
      <div className=" w-full max-w-md animate-fade-in">
        <Link to='/login' className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-10 transiton-colors">
        <ArrowLeftIcon size={16}/> Back to Portals</Link>
      </div>
    </div>
  );
}

export default LoginForm;
