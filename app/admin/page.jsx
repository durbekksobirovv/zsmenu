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
  DollarSign,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const router = useRouter();

  // --- DARK MODE STATE ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- STATES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const ADMIN_PASSWORD = "Zoirbek";

  const [activeTab, setActiveTab] = useState("orders");
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]);

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

  // --- INITIAL LOAD & THEME ---
  useEffect(() => {
    // Arxivni yuklash
    const savedArchive = localStorage.getItem("food_archive");
    if (savedArchive) setArchivedOrders(JSON.parse(savedArchive));

    // Temani yuklash
    const savedTheme = localStorage.getItem("admin_theme");
    if (savedTheme === "dark") setIsDarkMode(true);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("admin_theme", newMode ? "dark" : "light");
  };

  // --- STATISTIKA HISOBLASH ---
  const statsSummary = useMemo(() => {
    let totalRevenue = 0;
    let totalItems = 0;
    const itemStats = {};
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
      console.error("Xato:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(loadData, 5000);
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
        method,
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

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const archiveOrder = async (orderId) => {
    if (!confirm("Buyurtma yakunlandimi?")) return;
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
      alert("Xato!");
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

  const resetStats = () => {
    if (confirm("Statistikani nollash?")) {
      setArchivedOrders([]);
      localStorage.removeItem("food_archive");
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-950" : "bg-slate-100"} p-4`}
      >
        <div
          className={`w-full max-w-md rounded-3xl p-10 shadow-xl text-center border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
            <Lock size={32} />
          </div>
          <h1
            className={`text-2xl font-bold mb-6 tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}
          >
            ADMIN PANEL
          </h1>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input
              type="password"
              autoFocus
              placeholder="Parol"
              className={`w-full p-4 rounded-xl outline-none text-center font-bold text-lg border-2 transition-all ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-100 text-slate-900"} ${authError ? "border-red-500" : "focus:border-teal-500"}`}
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
    <div
      className={`flex min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? "bg-[#0f172a] text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      {/* SIDEBAR */}
      <aside
        className={`hidden md:flex w-64 flex-col fixed h-full shadow-2xl z-50 transition-colors ${isDarkMode ? "bg-slate-900 border-r border-slate-800" : "bg-teal-950 text-white"}`}
      >
        <div
          className={`p-8 flex items-center gap-3 border-b ${isDarkMode ? "border-slate-800" : "border-teal-900"}`}
        >
          <LayoutDashboard className="text-teal-400" />
          <span className="font-black text-xl tracking-tight">FOOD ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[
            { id: "orders", icon: Package, label: "Buyurtmalar" },
            { id: "menu", icon: Utensils, label: "Taomlar Menusi" },
            { id: "categories", icon: Tag, label: "Kategoriyalar" },
            { id: "stats", icon: BarChart3, label: "Statistika" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === item.id ? "bg-teal-600 shadow-lg font-bold text-white" : isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-teal-900 text-teal-100/70"}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
        <div
          className={`p-4 border-t ${isDarkMode ? "border-slate-800" : "border-teal-900"}`}
        >
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
        <header
          className={`border-b p-6 flex justify-between items-center sticky top-0 z-40 shadow-sm transition-colors ${isDarkMode ? "bg-slate-900/80 backdrop-blur-md border-slate-800" : "bg-white border-slate-200"}`}
        >
          <h1
            className={`text-xl md:text-2xl font-black uppercase ${isDarkMode ? "text-white" : "text-slate-800"}`}
          >
            {activeTab === "orders"
              ? "Buyurtmalar"
              : activeTab === "menu"
                ? "Menyu"
                : activeTab === "categories"
                  ? "Kategoriyalar"
                  : "Statistika"}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-2xl transition-all ${isDarkMode ? "bg-slate-800 text-yellow-400" : "bg-slate-100 text-slate-600"}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {activeTab === "stats" && (
              <button
                onClick={resetStats}
                className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100"
              >
                <RotateCcw size={14} /> Tozalash
              </button>
            )}
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Umumiy Savdo",
                val: `${statsSummary.totalRevenue.toLocaleString()} uzs`,
                icon: DollarSign,
                color: "text-teal-600",
              },
              {
                label: "Buyurtmalar",
                val: `${statsSummary.totalOrders} ta`,
                icon: Package,
                color: "text-blue-600",
              },
              {
                label: "Sotilganlar",
                val: `${statsSummary.totalItems} dona`,
                icon: ShoppingBag,
                color: "text-orange-600",
              },
              {
                label: "Top Taom",
                val: statsSummary.topDish,
                icon: Utensils,
                color: "text-purple-600",
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`p-6 rounded-[2rem] shadow-sm border transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
              >
                <s.icon className={`${s.color} mb-2`} size={20} />
                <p className="text-slate-400 text-[10px] font-bold uppercase">
                  {s.label}
                </p>
                <h2 className="text-xl font-black truncate">{s.val}</h2>
              </div>
            ))}
          </div>

          {activeTab === "orders" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {orders.length === 0 ? (
                <div
                  className={`col-span-full text-center py-20 text-slate-400 rounded-3xl border-2 border-dashed ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}
                >
                  Hozircha yangi buyurtmalar yo'q
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className={`rounded-3xl p-6 shadow-sm border transition-all ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} ${order.status === "Tayyor" ? "border-green-500/50 bg-green-500/5" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">
                          {order.customerName || "Mijoz"}
                        </h3>
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="text-teal-500 font-bold flex items-center gap-2 text-sm"
                        >
                          <Phone size={14} /> {order.customerPhone}
                        </a>
                      </div>
                      {order.status === "Tayyor" && (
                        <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                          Tayyor
                        </span>
                      )}
                    </div>
                    <div
                      className={`border rounded-2xl p-4 space-y-2 mb-6 ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"}`}
                    >
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {item.title}{" "}
                            <span className="text-teal-500 font-black">
                              x{item.quantity}
                            </span>
                          </span>
                          <span className="font-bold">
                            {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {order.status !== "Tayyor" ? (
                        <button
                          onClick={() => updateStatus(order.id, "Tayyor")}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={18} /> Tayyor (Xabar yuborish)
                        </button>
                      ) : (
                        <div className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-center">
                          Xabar yuborilgan ✅
                        </div>
                      )}
                      <button
                        onClick={() => archiveOrder(order.id)}
                        className={`w-full py-3 rounded-xl font-bold transition-all ${isDarkMode ? "bg-slate-800 hover:bg-black text-white" : "bg-teal-900 hover:bg-black text-white"}`}
                      >
                        Yakunlash (Arxiv)
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === "menu" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-bold">Ro'yxat ({foods.length})</h2>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setIsModalOpen(true);
                  }}
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
                      alt=""
                    />
                    <h4 className="font-bold truncate">{food.title}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase">
                      {food.category}
                    </p>
                    <p className="text-teal-500 font-black mt-2">
                      {Number(food.price).toLocaleString()} so'm
                    </p>
                    <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setCurrentFood(food);
                          setEditMode(true);
                          setIsModalOpen(true);
                        }}
                        className={`p-2 rounded-full shadow-lg ${isDarkMode ? "bg-slate-800 text-blue-400" : "bg-white text-blue-500"}`}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteFood(food.id)}
                        className={`p-2 rounded-full shadow-lg ${isDarkMode ? "bg-slate-800 text-red-400" : "bg-white text-red-500"}`}
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
              <div
                className={`p-8 rounded-[2.5rem] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
              >
                <h2 className="text-xl font-bold mb-6">Yangi Kategoriya</h2>
                <div className="flex gap-4">
                  <input
                    className={`flex-1 p-4 rounded-2xl outline-none border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-100"}`}
                    placeholder="Nomi..."
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
              <div
                className={`p-8 rounded-[2.5rem] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
              >
                <h2 className="text-xl font-bold mb-6">Mavjudlar</h2>
                <div className="grid gap-3">
                  {categories.map((cat, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center p-4 rounded-2xl group ${isDarkMode ? "bg-slate-800" : "bg-slate-50"}`}
                    >
                      <span className="font-bold">{cat}</span>
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
            <div
              className={`rounded-[2.5rem] border overflow-hidden transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
            >
              <div
                className={`p-8 border-b ${isDarkMode ? "bg-slate-800/50 border-slate-800" : "bg-slate-50/50 border-slate-100"}`}
              >
                <h2 className="text-xl font-bold">Sotuvlar Tahlili</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr
                      className={`text-[10px] uppercase font-black ${isDarkMode ? "bg-slate-800/30 text-slate-500" : "bg-slate-50 text-slate-400"}`}
                    >
                      <th className="px-8 py-4">Taom</th>
                      <th className="px-8 py-4 text-center">Sotilgan</th>
                      <th className="px-8 py-4">Narxi</th>
                      <th className="px-8 py-4 text-right">Tushum</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${isDarkMode ? "divide-slate-800" : "divide-slate-100"}`}
                  >
                    {statsSummary.detailedStats.map(([title, data], index) => (
                      <tr
                        key={index}
                        className={`transition-colors ${isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50/50"}`}
                      >
                        <td className="px-8 py-5 font-bold">{title}</td>
                        <td className="px-8 py-5 text-center">
                          <span className="bg-teal-500/10 text-teal-500 px-3 py-1 rounded-lg font-black text-sm">
                            {data.quantity} ta
                          </span>
                        </td>
                        <td className="px-8 py-5 text-slate-500 text-sm">
                          {data.price.toLocaleString()}
                        </td>
                        <td className="px-8 py-5 text-right font-black">
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

      {/* MOBILE NAV */}
      <nav
        className={`md:hidden fixed bottom-0 w-full border-t p-2 flex justify-around items-center z-50 transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
      >
        {[
          { id: "orders", icon: Package, label: "Zakas" },
          { id: "menu", icon: Utensils, label: "Taom" },
          { id: "categories", icon: Tag, label: "Kateg" },
          { id: "stats", icon: BarChart3, label: "Stats" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveTab(m.id)}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl ${activeTab === m.id ? "text-teal-500 bg-teal-500/10" : "text-slate-500"}`}
          >
            <m.icon size={22} />
            <span className="text-[10px] font-bold">{m.label}</span>
          </button>
        ))}
      </nav>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto transition-colors ${isDarkMode ? "bg-slate-900 text-white" : "bg-white"}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editMode ? "Tahrirlash" : "Yangi taom"}
              </h2>
              <button
                onClick={closeModal}
                className={`p-2 rounded-full ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div
                className={`relative w-full h-48 rounded-3xl overflow-hidden border-2 border-dashed flex items-center justify-center ${isDarkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"}`}
              >
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
                  className={`w-full p-4 rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-100"}`}
                  placeholder="Taom nomi"
                  value={currentFood.title}
                  onChange={(e) =>
                    setCurrentFood({ ...currentFood, title: e.target.value })
                  }
                />
                <input
                  type="number"
                  required
                  className={`w-full p-4 rounded-xl border outline-none font-bold text-teal-500 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
                  placeholder="Narxi"
                  value={currentFood.price}
                  onChange={(e) =>
                    setCurrentFood({ ...currentFood, price: e.target.value })
                  }
                />
                <select
                  className={`w-full p-4 rounded-xl border outline-none font-bold ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-100"}`}
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
                className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-teal-700"
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
