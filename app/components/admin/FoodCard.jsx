import React from "react";
import { Edit2, Trash2, Clock, Star } from "lucide-react";

const FoodCard = ({ product, onEdit, onDelete, isDarkMode }) => {
  // Narxni formatlash (masalan: 25,000)
  const formatPrice = (price) => {
    return new Intl.NumberFormat("uz-UZ").format(price);
  };

  return (
    <div
      className={`group relative rounded-[2.5rem] overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        isDarkMode
          ? "bg-slate-900/50 border-slate-800 hover:border-teal-500/50"
          : "bg-white border-slate-100 shadow-sm hover:border-teal-500/50"
      }`}
    >
      {/* Rasm qismi */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={
            product.image || "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hoverda chiqadigan boshqaruv tugmalari */}
        <div className="absolute top-4 right-4 flex gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button
            onClick={() => onEdit(product)}
            className="p-3 bg-teal-500 text-white rounded-2xl shadow-lg hover:bg-teal-600 active:scale-90 transition-all"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-3 bg-red-500 text-white rounded-2xl shadow-lg hover:bg-red-600 active:scale-90 transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Ma'lumotlar qismi */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3
            className={`text-xl font-black italic tracking-tighter uppercase ${isDarkMode ? "text-white" : "text-slate-900"}`}
          >
            {product.title}
          </h3>
          <span className="text-teal-500 font-black text-lg">
            {formatPrice(product.price)}{" "}
            <small className="text-[10px] uppercase">so'm</small>
          </span>
        </div>

        <p className="...">
          {/* Agar backend description deb yuborsa, bu yerda ham description bo'lishi kerak */}
          {product.desc ||
            product.description ||
            "Taom haqida ma'lumot kiritilmagan."}
        </p>

        {/* Qo'shimcha ma'lumotlar (Badge-lar) */}
        <div className="flex items-center gap-3 pt-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}
          >
            <Clock size={14} className="text-teal-500" />
            15-20 min.
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}
          >
            <Star size={14} className="text-orange-500 fill-orange-500" />
            4.8
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
