"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  X,
  Camera,
  Package,
  Utensils,
  Edit3,
  Phone,
  Lock,
  LogOut,
  LayoutDashboard,
  Tag,
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  RotateCcw, // Yangi belgi: Statistika reset qilish uchun
} from "lucide-react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const router = useRouter();

  // --- STATES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const ADMIN_PASSWORD = "123";

  const [activeTab, setActiveTab] = useState("orders");
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]); // ARXIV UCHUN STATE

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

  // --- LOCAL STORAGE'DAN ARXIVNI YUKLASH ---
  useEffect(() => {
    const savedArchive = localStorage.getItem("food_archive");
    if (savedArchive) {
      setArchivedOrders(JSON.parse(savedArchive));
    }
  }, []);

  // --- STATISTIKA HISOBLASH (FAOL + ARXIVDAGILAR) ---
  const statsSummary = useMemo(() => {
    let totalRevenue = 0;
    let totalItems = 0;
    const itemStats = {};

    // Barcha buyurtmalarni birlashtiramiz
    const allOrders = [...orders, ...archivedOrders];

    allOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        totalRevenue += price * qty;
        totalItems += qty;

        if (itemStats[item.title]) {
          itemStats[item.title].quantity += qty;
          itemStats[item.title].totalSum += price * qty;
        } else {
          itemStats[item.title] = {
            quantity: qty,
            totalSum: price * qty,
            price: price,
          };
        }
      });
    });

    const topDish = Object.entries(itemStats).sort(
      (a, b) => b[1].quantity - a[1].quantity,
    )[0];

    return {
      totalRevenue,
      totalOrders: allOrders.length,
      totalItems,
      topDish: topDish ? topDish[0] : "Yo'q",
      detailedStats: Object.entries(itemStats).sort(
        (a, b) => b[1].quantity - a[1].quantity,
      ),
    };
  }, [orders, archivedOrders]);

  // --- AUTH ---
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // --- DATA LOADING ---
  const loadData = async () => {
    if (!isAuthenticated) return;
    try {
      const [foodsRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/foods`),
        fetch(`${API_BASE_URL}/orders`),
      ]);
      if (foodsRes.ok) setFoods(await foodsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (error) {
      console.error("Ma'lumot yuklashda xato:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(loadData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // --- FUNCTIONS ---
  const handleSave = async (e) => {
    e.preventDefault();
    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `${API_BASE_URL}/foods/${currentFood.id}`
      : `${API_BASE_URL}/foods`;
    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentFood),
      });
      if (res.ok) {
        loadData();
        closeModal();
      }
    } catch (error) {
      alert("Xato!");
    }
  };

  // --- BUYURTMANI BAJARISH VA ARXIVLASH ---
  const deleteOrder = async (orderId) => {
    if (!confirm("Buyurtma bajarildimi? Statistika saqlanadi.")) return;

    // O'chirilayotgan buyurtma ob'ektini topib olamiz
    const orderToArchive = orders.find((o) => o.id === orderId);

    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (orderToArchive) {
          const newArchive = [...archivedOrders, orderToArchive];
          setArchivedOrders(newArchive);
          localStorage.setItem("food_archive", JSON.stringify(newArchive));
        }
        loadData();
      }
    } catch (error) {
      alert("O'chirishda xato!");
    }
  };

  // ARXIVNI TOZALASH (Statistikani nollash uchun)
  const resetStats = () => {
    if (confirm("Haqiqatan ham barcha arxiv statistikani nollamoqchimisiz?")) {
      setArchivedOrders([]);
      localStorage.removeItem("food_archive");
    }
  };

  const deleteFood = async (foodId) => {
    if (!confirm("O'chirilsinmi?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/foods/${foodId}`, {
        method: "DELETE",
      });
      if (res.ok) loadData();
    } catch (error) {
      alert("Xato!");
    }
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

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 font-sans text-slate-900">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-xl text-center border border-slate-200">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-6 tracking-widest">
            ADMIN PANEL
          </h1>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input
              type="password"
              autoFocus
              placeholder="Parol"
              className={`w-full p-4 bg-slate-50 rounded-xl outline-none text-center font-bold text-lg border-2 transition-all ${authError ? "border-red-500" : "border-slate-100 focus:border-teal-500"}`}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all"
            >
              KIRISH
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-teal-950 flex-col text-white fixed h-full shadow-2xl">
        <div className="p-8 flex items-center gap-3 border-b border-teal-900">
          <LayoutDashboard className="text-teal-400" />
          <span className="font-black text-xl tracking-tight">FOOD ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === "orders" ? "bg-teal-600 shadow-lg font-bold" : "hover:bg-teal-900 text-teal-100/70"}`}
          >
            <Package size={20} /> Buyurtmalar
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === "menu" ? "bg-teal-600 shadow-lg font-bold" : "hover:bg-teal-900 text-teal-100/70"}`}
          >
            <Utensils size={20} /> Taomlar Menusi
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === "categories" ? "bg-teal-600 shadow-lg font-bold" : "hover:bg-teal-900 text-teal-100/70"}`}
          >
            <Tag size={20} /> Kategoriyalar
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === "stats" ? "bg-teal-600 shadow-lg font-bold" : "hover:bg-teal-900 text-teal-100/70"}`}
          >
            <BarChart3 size={20} /> Statistika
          </button>
        </nav>
        <div className="p-4 border-t border-teal-900">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} /> Chiqish
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8">
        <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">
            {activeTab === "orders"
              ? "Buyurtmalar"
              : activeTab === "menu"
                ? "Menyu"
                : activeTab === "categories"
                  ? "Kategoriyalar"
                  : "Statistika"}
          </h1>
          <div className="flex items-center gap-4">
            {activeTab === "stats" && (
              <button
                onClick={resetStats}
                className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
              >
                <RotateCcw size={14} /> Statistikani Tozalash
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-100 px-4 py-2 rounded-full">
              <TrendingUp size={16} className="text-teal-600" /> Umumiy faollik
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
          {/* --- DOIMIY STATISTIKA KARTALARI --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-4">
                <DollarSign size={20} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Umumiy Savdo
              </p>
              <h2 className="text-2xl font-black text-slate-800 mt-1">
                {statsSummary.totalRevenue.toLocaleString()}{" "}
                <span className="text-sm font-normal text-slate-400">uzs</span>
              </h2>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <Package size={20} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Jami Buyurtmalar
              </p>
              <h2 className="text-2xl font-black text-slate-800 mt-1">
                {statsSummary.totalOrders}{" "}
                <span className="text-sm font-normal text-slate-400">ta</span>
              </h2>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                <ShoppingBag size={20} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Sotilganlar
              </p>
              <h2 className="text-2xl font-black text-slate-800 mt-1">
                {statsSummary.totalItems}{" "}
                <span className="text-sm font-normal text-slate-400">dona</span>
              </h2>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                <Utensils size={20} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Eng o'tishli taom
              </p>
              <h2 className="text-lg font-black text-slate-800 mt-1 truncate">
                {statsSummary.topDish}
              </h2>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* TAB CONTENT */}
          {activeTab === "orders" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {orders.length === 0 ? (
                <div className="col-span-full text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
                  Hozircha yangi buyurtmalar yo'q
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <div className="mb-4">
                      <h3 className="font-bold text-lg text-slate-800">
                        {order.customerName || "Mijoz"}
                      </h3>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-teal-600 font-bold flex items-center gap-2 text-sm"
                      >
                        <Phone size={14} /> {order.customerPhone}
                      </a>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-2 mb-6">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {item.title}{" "}
                            <span className="text-teal-600 font-black">
                              x{item.quantity}
                            </span>
                          </span>
                          <span className="font-bold">
                            {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold transition-colors"
                    >
                      Tayyor / Bajarildi
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === "menu" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-700">
                  Taomlar Ro'yxati ({foods.length})
                </h2>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setIsModalOpen(true);
                  }}
                  className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
                >
                  <Plus size={20} /> Taom Qo'shish
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm group relative overflow-hidden"
                  >
                    <img
                      src={food.img}
                      className="w-full h-40 rounded-2xl object-cover mb-4"
                      alt=""
                    />
                    <h4 className="font-bold text-slate-800 truncate">
                      {food.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase mb-2">
                      {food.category}
                    </p>
                    <p className="text-teal-700 font-black">
                      {Number(food.price).toLocaleString()} so'm
                    </p>
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setCurrentFood(food);
                          setEditMode(true);
                          setIsModalOpen(true);
                        }}
                        className="p-2 bg-white rounded-full text-blue-500 shadow-lg"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteFood(food.id)}
                        className="p-2 bg-white rounded-full text-red-500 shadow-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "categories" ? (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Kategoriyalar bo'limi kodingiz o'zgarmadi */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Yangi Kategoriya</h2>
                <div className="flex gap-4">
                  <input
                    className="flex-1 bg-slate-50 p-4 rounded-2xl outline-none border border-slate-100 focus:border-teal-500"
                    placeholder="Nomini yozing..."
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      if (newCatInput.trim()) {
                        setCategories([...categories, newCatInput]);
                        setNewCatInput("");
                      }
                    }}
                    className="bg-teal-600 text-white px-8 rounded-2xl font-bold"
                  >
                    Qo'shish
                  </button>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Mavjud Kategoriyalar</h2>
                <div className="grid gap-3">
                  {categories.map((cat, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl group"
                    >
                      <span className="font-bold text-slate-700">{cat}</span>
                      <button
                        onClick={() =>
                          setCategories(categories.filter((c) => c !== cat))
                        }
                        className="p-2 text-red-500 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">
                  Sotuvlar Bo'yicha Tahlil (Arxiv bilan)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                      <th className="px-8 py-4">Taom nomi</th>
                      <th className="px-8 py-4 text-center">Sotilgan soni</th>
                      <th className="px-8 py-4">Narxi</th>
                      <th className="px-8 py-4 text-right">Umumiy tushum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {statsSummary.detailedStats.map(([title, data], index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-5 font-bold text-slate-700">
                          {title}
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-lg font-black text-sm">
                            {data.quantity} ta
                          </span>
                        </td>
                        <td className="px-8 py-5 text-slate-500 text-sm">
                          {data.price.toLocaleString()} so'm
                        </td>
                        <td className="px-8 py-5 text-right font-black text-slate-900">
                          {data.totalSum.toLocaleString()} so'm
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MOBILE NAV (Oldingi kodingiz bilan bir xil) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t p-2 flex justify-around items-center z-40 shadow-2xl">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl ${activeTab === "orders" ? "text-teal-600 bg-teal-50" : "text-slate-400"}`}
        >
          <Package size={22} />{" "}
          <span className="text-[10px] font-bold">Zakaslar</span>
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl ${activeTab === "menu" ? "text-teal-600 bg-teal-50" : "text-slate-400"}`}
        >
          <Utensils size={22} />{" "}
          <span className="text-[10px] font-bold">Taomlar</span>
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl ${activeTab === "categories" ? "text-teal-600 bg-teal-50" : "text-slate-400"}`}
        >
          <Tag size={22} />{" "}
          <span className="text-[10px] font-bold">Kateg...</span>
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl ${activeTab === "stats" ? "text-teal-600 bg-teal-50" : "text-slate-400"}`}
        >
          <BarChart3 size={22} />{" "}
          <span className="text-[10px] font-bold">Stats</span>
        </button>
      </nav>

      {/* MODAL (Oldingi kodingiz bilan bir xil) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editMode ? "Tahrirlash" : "Yangi taom"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 bg-slate-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="relative w-full h-48 rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                {currentFood.img ? (
                  <img
                    src={currentFood.img}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="text-center text-slate-400">
                    <Camera size={32} className="mx-auto mb-2" />
                    <span className="text-xs font-bold uppercase">
                      Rasm yuklash
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setCurrentFood({ ...currentFood, img: reader.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <div className="space-y-4">
                <input
                  required
                  className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100"
                  placeholder="Taom nomi"
                  value={currentFood.title}
                  onChange={(e) =>
                    setCurrentFood({ ...currentFood, title: e.target.value })
                  }
                />
                <input
                  type="number"
                  required
                  className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 font-bold text-teal-700"
                  placeholder="Narxi (so'm)"
                  value={currentFood.price}
                  onChange={(e) =>
                    setCurrentFood({ ...currentFood, price: e.target.value })
                  }
                />
                <select
                  className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 font-bold"
                  value={currentFood.category}
                  onChange={(e) =>
                    setCurrentFood({ ...currentFood, category: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg"
              >
                Saqlash
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
