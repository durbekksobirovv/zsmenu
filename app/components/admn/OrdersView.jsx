"use client";
import React from "react";
import { Phone, Clock, CheckCircle2, PackageOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const OrdersView = ({ orders, onDelete }) => {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Yaqinda";
    return d.toLocaleString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Eng yangi buyurtmalar doim tepada
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt),
  );

  return (
    <div className="space-y-4 pb-24 w-full px-2 md:px-6">
      {/* 🌤️ CLEAN HEADER */}
      <div className="w-full flex items-center mt-6 justify-between bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <PackageOpen size={28} className="text-emerald-500" />
          </div>
          <div >
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
              Buyurtmalar{" "}
              <span className="text-emerald-500 italic">Navbati</span>
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Active Queue
            </p>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-2 rounded-full border border-slate-100 text-xs font-black text-slate-500">
          SONI: {orders.length}
        </div>
      </div>

      {/* 🧾 ORDERS LIST */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {sortedOrders.map((order) => (
            <motion.div
              key={order._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: 100, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white p-5 md:p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-emerald-200 transition-all duration-300 group shadow-sm"
            >
              {/* 📞 LEFT: Info */}
              <div className="flex items-center gap-6 min-w-[250px] w-full md:w-auto">
                <div className="w-16 h-16 rounded-[1.8rem] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-inner">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-2xl tracking-tight mb-1">
                    {order.phone || "Noma'lum"}
                  </p>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase italic">
                    <Clock size={14} />{" "}
                    {formatDate(order.date || order.createdAt)}
                  </div>
                </div>
              </div>

              {/* 📦 CENTER: Items (Kengroq joy egallaydi) */}
              <div className="flex-1 flex flex-wrap gap-2 w-full">
                {order.items?.map((it, i) => (
                  <span
                    key={i}
                    className="bg-slate-50/50 px-5 py-3 rounded-2xl text-[12px] font-black border border-slate-100 text-slate-600 flex items-center gap-3"
                  >
                    <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 italic">
                      {it.soni || it.quantity || 1}x
                    </span>
                    {it.nomi || it.name}
                  </span>
                ))}
              </div>

              {/* ⚙️ RIGHT: Single Action */}
              <div className="w-full md:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(order._id, "orders")}
                  className="w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-[1.8rem] text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <CheckCircle2 size={20} />
                  Tayyor
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[3rem]"
        >
          <p className="text-slate-400 font-black uppercase tracking-[0.3em]">
            Hozircha buyurtmalar yo'q
          </p>
        </motion.div>
      )}
    </div>
  );
};
