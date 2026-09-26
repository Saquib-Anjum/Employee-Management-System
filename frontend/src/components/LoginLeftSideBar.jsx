import React from "react";

function LoginLeftSideBar() {
  return (
    <div className="relative hidden min-h-screen w-1/2 overflow-hidden border-r border-slate-200 bg-indigo-950 md:flex">
      {/* Background Decorative Glow */}
      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
        <h1 className="mb-6 text-4xl font-medium leading-tight tracking-tight text-white lg:text-5xl">
          Employee <br /> Management System
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-slate-400">
          Streamline your workforce operations, track attendance, manage
          payroll, and empower your team securely.
        </p>
      </div>
      
    </div>
  );
}

export default LoginLeftSideBar;
