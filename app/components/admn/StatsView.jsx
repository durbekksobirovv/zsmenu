"use client";
import React, { useState, useMemo } from "react"; // ✅ useMemo qo'shildi
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  Award,
  Flame,
  BarChart3,
  RotateCcw,
  Trophy,
} from "lucide-react";

export const StatsView = ({
  data,
  subTab,
  setSubTab,
  onDetailClick,
  onReset,
}) => {
  // 🏆 Eng ko'p sotilgan mahsulotlarni miqdori bo'yicha saralash
  const topItems = useMemo(() => {
    if (!data?.sorted || !Array.isArray(data.sorted)) return [];
    // Miqdori bo'yicha yana bir bor tekshirib saralash (eng ko'p zakaz qilingani 1-o'rinda)
    return [...data.sorted].sort((a, b) => b.qty - a.qty);
  }, [data]);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => onDetailClick(), 800);
  };

  return (
    <div className="relative space-y-10 pb-20 w-full px-2 md:px-6">
      {/* 🎬 CYBER-TRANSITION LOADING */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900"
          >
            <div className="flex items-end gap-2 h-32 mb-6">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [20, 100, 40, 100] }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.05,
                    repeat: Infinity,
                  }}
                  className="w-3 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]"
                />
              ))}
            </div>
            <p className="text-emerald-500 font-black tracking-[1em] uppercase text-[10px]">
              Data Loading
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔝 HEADER */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />{" "}
            Analytics Center
          </p>
          <h2 className="text-5xl font-black text-slate-900 italic tracking-tighter uppercase">
            Sotuv{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Reytingi
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="group flex items-center gap-2 bg-white border border-red-100 text-red-500 px-6 py-5 rounded-[2rem] shadow-sm hover:bg-red-50"
          >
            <RotateCcw
              size={18}
              className="group-hover:rotate-[-180deg] transition-transform duration-500"
            />
            <span className="text-[10px] font-black uppercase tracking-widest italic">
              Tozalash
            </span>
          </motion.button>

          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartTransition}
            className="bg-slate-900 text-white px-8 py-5 rounded-[2rem] flex items-center gap-4 shadow-xl"
          >
            <div className="text-left text-xs font-black uppercase italic tracking-widest">
              To'liq hisobot
            </div>
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center rotate-3">
              <BarChart3 size={20} />
            </div>
          </motion.button>
        </div>
      </div>

      {/* 🚀 KPI CARDS (Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {[
          {
            label: "Jami Savdo",
            val: data?.summa || 0,
            icon: TrendingUp,
            color: "from-emerald-600 to-teal-600",
            unit: "UZS",
          },
          {
            label: "Buyurtmalar",
            val: data?.count || 0,
            icon: ShoppingBag,
            color: "from-blue-600 to-indigo-600",
            unit: "TA",
          },
          {
            label: "Filtr Rejimi",
            val: subTab,
            icon: Flame,
            color: "from-orange-500 to-red-600",
            unit: "MODE",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`p-8 rounded-[3rem] bg-gradient-to-br ${card.color} text-white shadow-2xl relative overflow-hidden`}
          >
            <card.icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 italic mb-2">
                {card.label}
              </p>
              <h3 className="text-4xl font-black italic tracking-tighter">
                {typeof card.val === "number"
                  ? card.val.toLocaleString()
                  : card.val}
                <span className="text-sm font-light opacity-60 ml-2 uppercase">
                  {card.unit}
                </span>
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 TABS */}
      <div className="flex justify-center relative z-10">
        <div className="bg-white/80 backdrop-blur-md p-2 rounded-full border border-slate-100 shadow-xl flex gap-1">
          {["kunlik", "haftalik", "oylik"].map((t) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                subTab === t
                  ? "bg-slate-900 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 🏆 LEADERBOARD (Eng ko'p zakaz qilinganlar birinchi chiqadi) */}
      <div className="relative z-10 bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[4rem] border border-white shadow-2xl">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 bg-amber-500 rounded-[2rem] flex items-center justify-center shadow-lg shadow-amber-200">
            <Trophy size={32} className="text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
              Top Mahsulotlar
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Eng ko'p buyurtma berilganlar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {topItems.map((item, i) => {
            const maxQty = topItems[0]?.qty || 1;
            const percentage = (item.qty / maxQty) * 100;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-6 p-4 rounded-[2.5rem] transition-all hover:bg-white/50 border ${
                  i === 0
                    ? "bg-amber-50 border-amber-200"
                    : "border-transparent"
                }`}
              >
                <div
                  className={`w-16 h-20 rounded-[1.8rem] flex items-center justify-center font-black text-2xl italic ${
                    i === 0
                      ? "bg-slate-900 text-amber-400 shadow-xl"
                      : "bg-slate-100 text-slate-300"
                  }`}
                >
                  {i + 1}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-black text-slate-800 uppercase italic tracking-tighter">
                      {item.name}
                    </h4>
                    <span className="font-black text-emerald-600 italic">
                      {item.qty}
                      <span className="text-[9px] uppercase">dona</span>
                    </span>
                  </div>

                  {/* Progress Bar: Sotilish hajmiga qarab to'ladi */}
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${i === 0 ? "bg-amber-500 shadow-[0_0_10px_#f59e0b]" : "bg-slate-900"}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
