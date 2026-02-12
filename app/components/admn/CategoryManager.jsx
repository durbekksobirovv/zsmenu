import React from "react";
import { Trash2 } from "lucide-react";

export const CategoryManager = ({
  categories,
  newCat,
  setNewCat,
  onAdd,
  onDelete,
}) => (
  <div className="max-w-4xl mx-auto space-y-10 pb-20">
    <div className="bg-white p-6 rounded-[3rem] flex gap-4 shadow-xl border border-white">
      <input
        value={newCat}
        onChange={(e) => setNewCat(e.target.value)}
        placeholder="Yangi bo'lim nomi..."
        className="flex-1 px-8 py-6 outline-none font-bold text-lg bg-slate-50 rounded-[2rem] shadow-inner"
      />
      <button
        onClick={onAdd}
        className="bg-emerald-500 text-white px-12 rounded-[2rem] font-black shadow-lg hover:bg-emerald-600 active:scale-95 transition-all text-2xl"
      >
        +
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((c) => (
        <div
          key={c._id}
          className="bg-white p-8 rounded-[2.5rem] flex justify-between items-center border border-slate-100 shadow-sm font-black text-xs uppercase italic hover:border-emerald-500 transition-all"
        >
          <span className="flex items-center gap-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" /> {c.nomi}
          </span>
          <button
            onClick={() => onDelete(c._id, "categories")}
            className="text-slate-200 hover:text-red-500 transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  </div>
);
