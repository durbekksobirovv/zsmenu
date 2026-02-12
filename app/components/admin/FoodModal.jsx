"use client";
import React from "react";
import { X, Camera, Trash2 } from "lucide-react";

const FoodModal = ({
  isDarkMode,
  setIsModalOpen,
  currentFood,
  setCurrentFood,
  editMode,
  API_BASE_URL,
  loadData,
}) => {
  const handleSave = async (e) => {
    e.preventDefault();
    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `${API_BASE_URL}/foods/${currentFood._id || currentFood.id}`
      : `${API_BASE_URL}/foods`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentFood),
      });

      if (res.ok) {
        await loadData(); // Ma'lumotlarni qayta yuklash
        setIsModalOpen(false); // Modalni yopish
      } else {
        alert("Saqlashda xatolik yuz berdi!");
      }
    } catch (error) {
      console.error("Xato:", error);
      alert("Server bilan aloqa yo'q!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentFood({ ...currentFood, img: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div
        className={`w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {editMode ? "Tahrirlash" : "Yangi taom"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 text-slate-400 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase ml-2">
              Taom rasmi
            </label>
            <div
              className={`relative h-48 rounded-3xl border-2 border-dashed flex items-center justify-center overflow-hidden ${isDarkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"}`}
            >
              {currentFood.img ? (
                <>
                  <img
                    src={currentFood.img}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                  <button
                    type="button"
                    onClick={() => setCurrentFood({ ...currentFood, img: "" })}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <label className="cursor-pointer text-center">
                  <Camera size={40} className="mx-auto text-slate-400" />
                  <span className="text-xs text-slate-500 block mt-2">
                    Rasm tanlang
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <input
            required
            placeholder="Taom nomi"
            className={`w-full p-4 rounded-2xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
            value={currentFood.title}
            onChange={(e) =>
              setCurrentFood({ ...currentFood, title: e.target.value })
            }
          />

          <input
            type="number"
            required
            placeholder="Narxi (so'm)"
            className={`w-full p-4 rounded-2xl border outline-none font-bold text-teal-500 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
            value={currentFood.price}
            onChange={(e) =>
              setCurrentFood({ ...currentFood, price: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-5 rounded-2xl font-black transition-all"
          >
            {editMode ? "SAQLASH" : "QO'SHISH"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FoodModal;
