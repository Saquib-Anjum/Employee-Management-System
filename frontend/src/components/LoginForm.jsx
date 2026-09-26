import React, { useState } from "react";
import LoginLeftSideBar from "./LoginLeftSideBar";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";

function LoginForm(props) {
  const { role, title, subtitle } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSideBar />
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className=" w-full max-w-md animate-fade-in">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-10 transiton-colors"
          >
            <ArrowLeftIcon size={16} /> Back to Portals
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium text-zinc-800">
              {title}
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              {subtitle}
            </p>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              {error}
            </div>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
           <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email address
              </label>
              <input
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              type="email" placeholder="jhon@gmail.com"
              required
              className=""
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              type={showPassword?'text':'password'} placeholder="Enter Your Password"
              required
              className="pr-11"
              />
              <button
              onClick={()=>{
                setShowPassword(!showPassword)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" type="button">{showPassword?<EyeOffIcon size={18}/>:<EyeIcon size={18}/>}</button>
              </div>
            </div>
            <button className="w-full py-3 bg-linear-to-r from-indigo-600 to-indigo-500 text-white rounded-md text-sm font-semibold hover:from-indigo-700 hover:to-indgo-600 disabled:cpacity-50 transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-[.98]flex items-center justify-center" type="submit" disabled>{loading&& <LoaderIcon className="animate-spin h-4 w-4 mr-2"/>}SignIn</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
