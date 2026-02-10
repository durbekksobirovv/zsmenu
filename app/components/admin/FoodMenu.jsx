import { Plus, Edit3, Trash2 } from "lucide-react";

const FoodMenu = ({ foods, onAdd, onEdit, onDelete, isDarkMode }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="font-bold">Ro'yxat ({foods.length})</h2>
      <button
        onClick={onAdd}
        className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-teal-700"
      >
        <Plus size={20} /> Qo'shish
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {foods.map((food) => (
        <div
          key={food.id}
          className={`p-4 rounded-3xl border shadow-sm group relative transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
        >
          <img
            src={food.img}
            className="w-full h-40 rounded-2xl object-cover mb-4"
            alt={food.title}
          />
          <h4 className="font-bold truncate">{food.title}</h4>
          <p className="text-teal-500 font-black mt-2">
            {Number(food.price).toLocaleString()} so'm
          </p>
          <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(food)}
              className={`p-2 rounded-full shadow-lg ${isDarkMode ? "bg-slate-800 text-blue-400" : "bg-white text-blue-500"}`}
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={() => onDelete(food.id)}
              className={`p-2 rounded-full shadow-lg ${isDarkMode ? "bg-slate-800 text-red-400" : "bg-white text-red-500"}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FoodMenu;
