import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export const ProductCard = ({ item, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl transition-all duration-500"
  >
    <div className="h-64 relative overflow-hidden p-3">
      <img
        src={item.rasmi}
        className="w-full h-full object-cover rounded-[2.8rem] group-hover:scale-105 transition-transform duration-700"
        alt={item.nomi}
      />
      <div className="absolute top-8 left-8 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-[10px] font-black text-emerald-600 uppercase">
        {item.category}
      </div>
    </div>
    <div className="p-10 pt-4 flex-1">
      <h4 className="font-black text-slate-900 text-2xl mb-3 truncate italic">
        {item.nomi}
      </h4>
      <p className="text-slate-400 text-xs italic mb-10 line-clamp-2 leading-relaxed">
        "{item.title || "Mazali taom"}"
      </p>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase mb-1">
            Narxi
          </p>
          <p className="font-black text-2xl text-slate-900 tracking-tighter">
            {Number(item.narxi).toLocaleString()} so'm
          </p>
        </div>
        <button
          onClick={() => onDelete(item._id, "products")}
          className="p-4 bg-red-50 text-red-400 rounded-3xl hover:bg-red-500 hover:text-white transition-all"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  </motion.div>
);
