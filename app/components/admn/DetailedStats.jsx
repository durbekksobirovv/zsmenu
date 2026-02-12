"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  BarChart3,
  LayoutGrid,
  TrendingUp,
  Award,
} from "lucide-react";

export const DetailedStats = ({ data, onBack }) => {
  const items = data?.sorted || [];
  const totalQty = items.reduce((acc, curr) => acc + curr.qty, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8 pb-20 px-2 md:px-6 w-full"
    >
      {/* 🔝 HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-16 h-16 bg-white border border-slate-100 rounded-[1.8rem] flex items-center justify-center text-slate-900 shadow-sm"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <div>
            <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em] mb-1">
              Data Insights
            </p>
            <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">
              Batafsil <span className="text-emerald-500">Hisobot</span>
            </h2>
          </div>
        </div>

        <div className="flex bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-white shadow-lg items-center gap-4 px-6">
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase italic">
              Jami Sotuv
            </p>
            <p className="text-xl font-black text-slate-900 italic">
              {totalQty} dona
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* 📊 DATA TABLE */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-12">
                  #
                </th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Mahsulot Nomi
                </th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                  Miqdori
                </th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-12">
                  Ulushi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.length > 0 ? (
                items.map((item, index) => {
                  const percentage =
                    totalQty > 0 ? Math.round((item.qty / totalQty) * 100) : 0;
                  return (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-6 pl-12">
                        <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 italic group-hover:bg-slate-900 group-hover:text-white transition-all">
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <Package size={18} />
                          </div>
                          <span className="font-black text-slate-800 uppercase italic tracking-tighter text-sm">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span className="px-5 py-2 bg-slate-900 text-white rounded-full text-[11px] font-black italic">
                          {item.qty} dona
                        </span>
                      </td>
                      <td className="p-6 text-right pr-12">
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-[10px] font-black text-slate-400 italic">
                            {percentage}%
                          </span>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                            />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-20 text-center opacity-30 font-black italic uppercase tracking-widest text-slate-400"
                  >
                    Ma'lumot topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
