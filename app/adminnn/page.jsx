"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  X,
  Camera,
  ArrowLeft,
  Package,
  Utensils,
  Edit3,
  CheckCircle2,
  Phone,
  Tag, // Yangi icon
} from "lucide-react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);

  // --- KATEGORIYA STATE'LARI ---
  const [categories, setCategories] = useState([
    "Fastfud",
    "Ichimliklar",
    "Shirinliklar",
    "Milliy Taomlar",
  ]);
  const [newCatInput, setNewCatInput] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const API_BASE_URL = "https://food-ordering-api-aapf.onrender.com/api";

  const [currentFood, setCurrentFood] = useState({
    id: null,
    title: "",
    price: "",
    category: "Fastfud",
    img: "",
    time: "15 daqiqa",
    rating: "5.0",
  });

  const loadData = async () => {
    try {
      const foodsRes = await fetch(`${API_BASE_URL}/foods`);
      if (foodsRes.ok) setFoods(await foodsRes.json());

      const ordersRes = await fetch(`${API_BASE_URL}/orders`);
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (error) {
      console.error("Ma'lumot yuklashda xato:", error);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Yangi kategoriya qo'shish funksiyasi
  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    if (categories.includes(newCatInput)) {
      alert("Bu kategoriya allaqachon mavjud!");
      return;
    }
    setCategories([...categories, newCatInput.trim()]);
    setCurrentFood({ ...currentFood, category: newCatInput.trim() });
    setNewCatInput("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setCurrentFood({ ...currentFood, img: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentFood.img) return alert("Rasm yuklang!");

    try {
      const res = await fetch(`${API_BASE_URL}/foods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentFood),
      });

      if (res.ok) {
        await loadData();
        closeModal();
      }
    } catch (error) {
      alert("Render serveri bilan aloqa yo'q!");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "DELETE",
      });
      if (res.ok) loadData();
    } catch (error) {
      alert("O'chirishda xato!");
    }
  };

  const deleteFood = async (foodId) => {
    if (!confirm("Ushbu taomni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/foods/${foodId}`, {
        method: "DELETE",
      });
      if (res.ok) loadData();
    } catch (error) {
      alert("O'chirishda xato!");
    }
  };

  const openEditModal = (food) => {
    setCurrentFood(food);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setCurrentFood({
      id: null,
      title: "",
      price: "",
      category: categories[0],
      img: "",
      time: "15 daqiqa",
      rating: "5.0",
    });
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-[450px] bg-white shadow-2xl h-[100vh] flex flex-col relative overflow-hidden font-sans">
        {/* HEADER */}
        <div className="p-6 bg-teal-900 text-white flex justify-between items-center shadow-lg">
          <button
            onClick={() => router.push("/")}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black uppercase">
            {activeTab === "orders" ? "Buyurtmalar" : "Menyu"}
          </h1>
          <button onClick={loadData} className="p-2">
            <Package size={20} className="opacity-50" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar bg-gray-50/50">
          {activeTab === "orders" ? (
            // ... Buyurtmalar kodi o'zgarishsiz qoldi
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Package size={48} className="mb-2 opacity-20" />
                  <p className="font-bold">Hozircha buyurtmalar yo'q</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-[2rem] p-5 shadow-sm border border-teal-50"
                  >
                    <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                      <div>
                        <h3 className="font-black text-gray-800 text-lg uppercase leading-none mb-1">
                          {order.customerName || "Ismsiz mijoz"}
                        </h3>
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="text-teal-600 font-bold text-sm flex items-center gap-1"
                        >
                          <Phone size={14} fill="currentColor" />{" "}
                          {order.customerPhone}
                        </a>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-gray-300 block">
                          #{order.id}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.title}{" "}
                            <span className="text-teal-600 font-black">
                              x{item.quantity}
                            </span>
                          </span>
                          <span className="font-bold">
                            {(item.price * item.quantity).toLocaleString()} so'm
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100">
                      <span className="text-xl font-black text-teal-900">
                        {order.total?.toLocaleString()} so'm
                      </span>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="bg-green-500 text-white px-5 py-3 rounded-2xl font-black text-xs"
                      >
                        TAYYOR
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setEditMode(false);
                  setIsModalOpen(true);
                }}
                className="w-full py-5 bg-white border-2 border-dashed border-teal-200 rounded-[2rem] text-teal-700 font-black flex items-center justify-center gap-2"
              >
                <Plus size={22} /> Yangi taom qo'shish
              </button>

              <div className="grid gap-3">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className="flex items-center gap-4 bg-white p-3 rounded-3xl border border-gray-100 shadow-sm"
                  >
                    <img
                      src={food.img}
                      className="w-16 h-16 rounded-2xl object-cover"
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-800 truncate">
                        {food.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {food.category}
                      </p>
                      <p className="text-teal-700 font-black text-xs">
                        {food.price?.toLocaleString()} so'm
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(food)}
                        className="p-2 text-blue-500"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteFood(food.id)}
                        className="p-2 text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAV */}
        <div className="absolute bottom-0 w-full bg-white border-t p-2 flex justify-around items-center z-40">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col items-center gap-1 py-2 px-8 rounded-2xl ${activeTab === "orders" ? "text-teal-900 bg-teal-50 font-black" : "text-gray-400"}`}
          >
            <Package size={22} />{" "}
            <span className="text-[10px] uppercase">Zakaslar</span>
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex flex-col items-center gap-1 py-2 px-8 rounded-2xl ${activeTab === "menu" ? "text-teal-900 bg-teal-50 font-black" : "text-gray-400"}`}
          >
            <Utensils size={22} />{" "}
            <span className="text-[10px] uppercase">Taomlar</span>
          </button>
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end">
            <div className="bg-white w-full rounded-t-[3rem] p-8 shadow-2xl max-h-[90%] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-800">
                  {editMode ? "Tahrirlash" : "Yangi taom"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-3 bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                {/* Image Upload Area */}
                <div className="group relative w-full h-44 rounded-[2rem] overflow-hidden border-4 border-gray-50 bg-gray-100">
                  {currentFood.img ? (
                    <img
                      src={currentFood.img}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-teal-600">
                      <Camera size={30} className="mb-2" />
                      <span className="font-black text-[10px] uppercase">
                        Rasm yuklash
                      </span>
                    </label>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="space-y-4">
                  <input
                    required
                    placeholder="Taom nomi"
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold"
                    value={currentFood.title}
                    onChange={(e) =>
                      setCurrentFood({ ...currentFood, title: e.target.value })
                    }
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      type="number"
                      placeholder="Narxi"
                      className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-black text-teal-800"
                      value={currentFood.price}
                      onChange={(e) =>
                        setCurrentFood({
                          ...currentFood,
                          price: e.target.value,
                        })
                      }
                    />

                    {/* KATEGORIYA SELECT */}
                    <select
                      className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold"
                      value={currentFood.category}
                      onChange={(e) =>
                        setCurrentFood({
                          ...currentFood,
                          category: e.target.value,
                        })
                      }
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* YANGI KATEGORIYA QO'SHISH BLOKI */}
                  <div className="bg-teal-50/50 p-4 rounded-[2rem] border border-teal-100">
                    <p className="text-[10px] font-black text-teal-800 uppercase mb-2 ml-1">
                      Yangi kategoriya qo'shish
                    </p>

                    <div className="flex gap-2">
                      <input
                        placeholder="Kategoriya nomi..."
                        className="flex-1 bg-white px-4 py-3 rounded-xl text-sm outline-none border border-teal-100"
                        value={newCatInput}
                        onChange={(e) => setNewCatInput(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="bg-teal-800 text-white px-4 rounded-xl font-bold text-xs active:scale-95 transition-transform"
                      >
                        QO'SHISH
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-900 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all"
                >
                  {editMode ? "O'zgarishlarni saqlash" : "Menyoga qo'shish"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
