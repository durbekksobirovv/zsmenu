"use client";
import React, { useState } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";
import FoodModal from "./FoodModal";

const FoodMenu = ({ foods, isDarkMode, loadData, API_BASE_URL }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFood, setCurrentFood] = useState({
    title: "",
    price: "",
    category: "Fastfud",
    img: "",
  });

  const handleDelete = async (id) => {
    if (!confirm("Ushbu mahsulotni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/foods/${id}`, {
        method: "DELETE",
      });
      if (res.ok) loadData();
    } catch (error) {
      alert("O'chirishda xatolik!");
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setCurrentFood({ title: "", price: "", category: "Fastfud", img: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditMode(true);
    setCurrentFood(food);
    setIsModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Yangi qo'shish tugmasi */}
      <button
        onClick={openAddModal}
        className={`p-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
          isDarkMode
            ? "border-teal-500/50 text-teal-500 hover:bg-teal-500/5"
            : "border-teal-200 text-teal-600 hover:bg-teal-50"
        }`}
      >
        <Plus size={40} />
        <span className="font-bold">Yangi qo'shish</span>
      </button>

      {/* Mahsulotlar ro'yxati */}
      {foods.map((food) => (
        <div
          key={food._id || food.id}
          className={`p-4 rounded-3xl border shadow-sm group relative ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
        >
          <img
            src={food.img}
            alt={food.title}
            className="w-full h-40 rounded-2xl object-cover mb-4"
          />
          <h4 className="font-bold">{food.title}</h4>
          <p className="text-teal-500 font-black">
            {Number(food.price).toLocaleString()} so'm
          </p>

          <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={() => openEditModal(food)}
              className="p-2 bg-blue-500 text-white rounded-full shadow-lg"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => handleDelete(food._id || food.id)}
              className="p-2 bg-red-500 text-white rounded-full shadow-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      {isModalOpen && (
        <FoodModal
          isDarkMode={isDarkMode}
          setIsModalOpen={setIsModalOpen}
          currentFood={currentFood}
          setCurrentFood={setCurrentFood}
          editMode={editMode}
          API_BASE_URL={API_BASE_URL}
          loadData={loadData}
        />
      )}
    </div>
  );
};

export default FoodMenu;
