import React, { useState } from "react";
import { LockIcon, X ,Send, Loader2Icon} from "lucide-react";
const ChangePasswordModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className=" fixed inset-0 z-50 flex items-center justify-center p-4 "
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center
      ">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in "
        >
          {/* heading */}
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2">
              {" "}
              <LockIcon /> Change Password
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-salte-600"
            >
              {" "}
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {message.text && (
              <div
                className={`p-3 rounded-xl text-sm flex items-start gap-3 ${message.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0  ${message.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}
                >
                  {message.text}
                </div>
              </div>
            )}
            <div>
              <label htmlFor="" className="block text-sm font-medium text-slate-700 mb-2"> Current Passowrd</label>
              <input type="password" name="currentPassword" required/>
            </div>
            <div>
              <label htmlFor="" className="block text-sm font-medium text-slate-700 mb-2"> Mew Passowrd</label>
              <input type="password" name="newPassword" required/>
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button type="button " onClick={onClose} className="btn-secondary">Cancle</button>

               <button type="submit"  className="btn-primary flex items-center gap-2" disabled={loading}>
                { loading && <Loader2Icon className="animate-spin w-4 h-4"/>
}<Send className="w-4 h-4"/> Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
