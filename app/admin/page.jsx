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

// --- SUB-COMPONENTS ---

// 1. Statistika Kartochkalari
const StatsCards = ({ stats, isDarkMode }) => {
  const cards = [
    {
      label: "Umumiy Savdo",
      val: `${stats.totalRevenue.toLocaleString()} uzs`,
      icon: DollarSign,
      color: "text-teal-600",
    },
    {
      label: "Buyurtmalar",
      val: `${stats.totalOrders} ta`,
      icon: Package,
      color: "text-blue-600",
    },
    {
      label: "Sotilganlar",
      val: `${stats.totalItems} dona`,
      icon: ShoppingBag,
      color: "text-orange-600",
    },
    {
      label: "Top Taom",
      val: stats.topDish,
      icon: Utensils,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((s, i) => (
        <div
          key={i}
          className={`p-6 rounded-[2rem] shadow-sm border transition-all ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
        >
          <s.icon className={`${s.color} mb-2`} size={20} />
          <p className="text-slate-400 text-[10px] font-bold uppercase">
            {s.label}
          </p>
          <h2 className="text-xl font-black truncate">{s.val}</h2>
        </div>
      ))}
    </div>
  );
};

// 2. Buyurtmalar Ro'yxati
const OrdersList = ({ orders, updateStatus, archiveOrder, isDarkMode }) => {
  if (orders.length === 0)
    return (
      <div
        className={`col-span-full text-center py-20 text-slate-400 rounded-3xl border-2 border-dashed ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}
      >
        Hozircha yangi buyurtmalar yo'q
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {orders.map((order) => (
        <div
          key={order._id || order.id}
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
                onClick={() => updateStatus(order._id || order.id, "Tayyor")}
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
              onClick={() => archiveOrder(order._id || order.id)}
              className={`w-full py-3 rounded-xl font-bold transition-all ${isDarkMode ? "bg-slate-800 hover:bg-black text-white" : "bg-teal-900 hover:bg-black text-white"}`}
            >
              Yakunlash (Arxiv)
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- ASOSIY PAGE COMPONENT ---
const AdminPage = () => {
  const API_BASE_URL = "https://food-ordering-api-1-6t2z.onrender.com/api";
  const ADMIN_PASSWORD = "123";

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);
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
  const [currentFood, setCurrentFood] = useState({
    id: null,
    title: "",
    price: "",
    category: "Fastfud",
    img: "",
    time: "15 daqiqa",
    rating: "5.0",
  });

  // 1. Ma'lumotlarni yuklash
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
    const savedArchive = localStorage.getItem("food_archive");
    if (savedArchive) setArchivedOrders(JSON.parse(savedArchive));
    const savedTheme = localStorage.getItem("admin_theme");
    if (savedTheme === "dark") setIsDarkMode(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(loadData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // 2. Statistika Hisoblash (useMemo bilan)
  const statsSummary = useMemo(() => {
    let totalRevenue = 0,
      totalItems = 0;
    const itemStats = {};
    const allOrders = [...orders, ...archivedOrders];

    allOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        totalRevenue += price * qty;
        totalItems += qty;
        if (!itemStats[item.title])
          itemStats[item.title] = { quantity: 0, totalSum: 0, price: price };
        itemStats[item.title].quantity += qty;
        itemStats[item.title].totalSum += price * qty;
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
      detailedStats: Object.entries(itemStats),
    };
  }, [orders, archivedOrders]);

  // 3. Amallar (Actions)
  const handleUpdateStatus = async (orderId, newStatus) => {
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

  const handleArchiveOrder = async (orderId) => {
    if (!confirm("Buyurtmani yakunlab arxivga qo'shmoqchimisiz?")) return;
    const orderToArchive = orders.find((o) => (o._id || o.id) === orderId);
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
      alert("Xatolik yuz berdi!");
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

  const handleSaveFood = async (e) => {
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
        setIsModalOpen(false);
        setEditMode(false);
      }
    } catch (error) {
      alert("Saqlashda xato!");
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-slate-100"} p-4`}
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === ADMIN_PASSWORD) setIsAuthenticated(true);
              else setAuthError(true);
            }}
            className="space-y-4"
          >
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
        className={`hidden md:flex w-64 flex-col fixed h-full shadow-2xl z-50 ${isDarkMode ? "bg-slate-900 border-r border-slate-800" : "bg-teal-950 text-white"}`}
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
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === item.id ? "bg-teal-600 shadow-lg font-bold text-white" : "hover:bg-slate-800/50 text-slate-400"}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 rounded-xl"
          >
            <LogOut size={20} /> Chiqish
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8">
        <header
          className={`border-b p-6 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md ${isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"}`}
        >
          <h1 className="text-xl md:text-2xl font-black uppercase">
            {activeTab}
          </h1>
          <button
            onClick={() => {
              setIsDarkMode(!isDarkMode);
              localStorage.setItem(
                "admin_theme",
                !isDarkMode ? "dark" : "light",
              );
            }}
            className={`p-3 rounded-2xl ${isDarkMode ? "bg-slate-800 text-yellow-400" : "bg-slate-100 text-slate-600"}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
          <StatsCards stats={statsSummary} isDarkMode={isDarkMode} />

          {activeTab === "orders" && (
            <OrdersList
              orders={orders}
              updateStatus={handleUpdateStatus}
              archiveOrder={handleArchiveOrder}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === "menu" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => {
                  setEditMode(false);
                  setCurrentFood({
                    title: "",
                    price: "",
                    category: "Fastfud",
                    img: "",
                  });
                  setIsModalOpen(true);
                }}
                className="p-6 rounded-3xl border-2 border-dashed border-teal-500/50 flex flex-col items-center justify-center gap-2 text-teal-500 hover:bg-teal-500/5 transition-all"
              >
                <Plus size={32} />{" "}
                <span className="font-bold">Yangi qo'shish</span>
              </button>
              {foods.map((food) => (
                <div
                  key={food.id}
                  className={`p-4 rounded-3xl border shadow-sm group relative ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
                >
                  <img
                    src={food.img}
                    className="w-full h-40 rounded-2xl object-cover mb-4"
                  />
                  <h4 className="font-bold">{food.title}</h4>
                  <p className="text-teal-500 font-black">
                    {Number(food.price).toLocaleString()} so'm
                  </p>
                  <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => {
                        setCurrentFood(food);
                        setEditMode(true);
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-blue-500 text-white rounded-full"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteFood(food.id)}
                      className="p-2 bg-red-500 text-white rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STATS TABLE */}
          {activeTab === "stats" && (
            <div
              className={`rounded-3xl border overflow-hidden ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <table className="w-full text-left">
                <thead className={isDarkMode ? "bg-slate-800" : "bg-slate-50"}>
                  <tr className="text-xs font-black uppercase">
                    <th className="p-6">Taom nomi</th>
                    <th className="p-6">Sotildi</th>
                    <th className="p-6 text-right">Jami tushum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {statsSummary.detailedStats.map(([title, data], i) => (
                    <tr key={i} className="hover:bg-teal-500/5 transition-all">
                      <td className="p-6 font-bold">{title}</td>
                      <td className="p-6">
                        <span className="bg-teal-500/10 text-teal-500 px-3 py-1 rounded-full">
                          {data.quantity} ta
                        </span>
                      </td>
                      <td className="p-6 text-right font-black">
                        {data.totalSum.toLocaleString()} uzs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto transition-all ${isDarkMode ? "bg-slate-900 text-white" : "bg-white"}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editMode ? "Tahrirlash" : "Yangi taom qo'shish"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-red-500/10 rounded-full text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFood} className="space-y-6">
              {/* RASM YUKLASH QISMI */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase ml-2">
                  Taom rasmi
                </label>
                <div
                  className={`relative w-full h-52 rounded-3xl overflow-hidden border-2 border-dashed transition-all flex items-center justify-center ${isDarkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"}`}
                >
                  {currentFood.img ? (
                    <>
                      <img
                        src={currentFood.img}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentFood({ ...currentFood, img: "" })
                        }
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer group">
                      <div className="p-4 rounded-2xl bg-teal-500/10 text-teal-500 group-hover:scale-110 transition-transform">
                        <Camera size={32} />
                      </div>
                      <span className="mt-2 text-sm font-medium text-slate-500">
                        Rasm tanlash uchun bosing
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCurrentFood({
                                ...currentFood,
                                img: reader.result,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* MA'LUMOTLAR QISMI */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-2">
                    TAOM NOMI
                  </label>
                  <input
                    required
                    className={`w-full p-4 rounded-2xl border outline-none focus:border-teal-500 transition-all ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
                    placeholder="Masalan: Lavash Max"
                    value={currentFood.title}
                    onChange={(e) =>
                      setCurrentFood({ ...currentFood, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-2">
                    NARXI (SO'M)
                  </label>
                  <input
                    type="number"
                    required
                    className={`w-full p-4 rounded-2xl border outline-none focus:border-teal-500 transition-all font-bold text-teal-500 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
                    placeholder="25000"
                    value={currentFood.price}
                    onChange={(e) =>
                      setCurrentFood({ ...currentFood, price: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-2">
                    KATEGORIYA
                  </label>
                  <select
                    className={`w-full p-4 rounded-2xl border outline-none focus:border-teal-500 transition-all font-medium ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100 text-slate-900"}`}
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
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-teal-900/20 active:scale-[0.98] transition-all"
              >
                {editMode ? "O'ZGARIŞHLARNI SAQLASH" : "TAOMNI QO'SHISH"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
