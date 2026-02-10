// components/admin/AuthModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  isDarkMode,
}) {
  const [formData, setFormData] = useState({ title: "", price: "", desc: "" });

  useEffect(() => {
    if (editingProduct) setFormData({ ...editingProduct });
    else setFormData({ title: "", price: "", desc: "" });
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className={`w-full max-w-md p-8 rounded-[2.5rem] relative animate-in zoom-in-95 duration-200 ${isDarkMode ? "bg-[#0f172a] border border-slate-800 text-white" : "bg-white text-slate-900"}`}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-red-500"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black mb-6 italic uppercase tracking-tighter">
          {editingProduct ? "Tahrirlash" : "Yangi mahsulot"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nomi"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-4 rounded-2xl bg-slate-800/50 border border-slate-700 outline-none focus:border-teal-500"
          />
          <input
            type="number"
            placeholder="Narxi"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full p-4 rounded-2xl bg-slate-800/50 border border-slate-700 outline-none focus:border-teal-500"
          />
          <textarea
            placeholder="Tavsif"
            rows="4"
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            className="w-full p-4 rounded-2xl bg-slate-800/50 border border-slate-700 outline-none focus:border-teal-500 resize-none"
          />
          <button
            onClick={() => onSave(formData)}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
          >
            {editingProduct ? "Saqlash" : "Qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
}
