import React from "react";
import { Lock } from "lucide-react";

const LoginComponent = ({
  isDarkMode,
  passwordInput,
  setPasswordInput,
  handleLogin,
  authError,
}) => {
  return (
    <div
      className={`flex items-center justify-center min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-slate-100"} p-4`}
    >
      <div
        className={`w-full max-w-md rounded-3xl p-10 shadow-xl text-center border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
      >
        <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
          <Lock size={32} />
        </div>
        <h1
          className={`text-2xl font-bold mb-6 tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}
        >
          ADMIN PANEL
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            autoFocus
            placeholder="Parol"
            className={`w-full p-4 rounded-xl outline-none text-center font-bold text-lg border-2 transition-all ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-slate-50 border-slate-100 text-slate-900"
            } ${authError ? "border-red-500" : "focus:border-teal-500"}`}
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all"
          >
            KIRISH
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
