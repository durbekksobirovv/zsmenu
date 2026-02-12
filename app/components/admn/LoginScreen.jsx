import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export const LoginScreen = ({ setIsAdmin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const ADMIN_PASSWORD = "123";

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("is_admin_authenticated", "true");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 w-full max-w-[440px] text-center shadow-2xl"
      >
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30 rotate-3">
          <Lock size={36} className="text-white" />
        </div>
        <h2 className="text-3xl font-black mb-10 italic tracking-tight">
          ADMIN <span className="text-emerald-500">LOGIN</span>
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••"
            className="w-full bg-white/5 p-6 rounded-2xl text-center outline-none border border-white/10 focus:border-emerald-500 text-xl font-bold tracking-[0.5em]"
          />
          <button className="w-full bg-emerald-500 py-6 rounded-2xl font-black shadow-xl hover:bg-emerald-600 active:scale-95 transition-all uppercase">
            KIRISH
          </button>
          {error && (
            <p className="text-red-400 font-bold text-xs mt-4">
              Parol noto'g'ri!
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};
