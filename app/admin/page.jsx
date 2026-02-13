"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Sidebar } from "@/app/components/admn/Sidebar";
import { StatsView } from "@/app/components/admn/StatsView";
import { ProductCard } from "@/app/components/admn/ProductCard";
import { LoginScreen } from "@/app/components/admn/LoginScreen";
import { OrdersView } from "@/app/components/admn/OrdersView";
import { AddProductForm } from "@/app/components/admn/AddProductForm";
import { CategoryManager } from "@/app/components/admn/CategoryManager";
import { DetailedStats } from "@/app/components/admn/DetailedStats";

import {
  Loader2,
  Menu,
  Sparkles,
  BellRing,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  PlusCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("stats");
  const [statsSubTab, setStatsSubTab] = useState("kunlik");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [productForm, setProductForm] = useState({
    nomi: "",
    title: "",
    narxi: "",
    category: "",
    rasmi: "",
  });
  const [newCatName, setNewCatName] = useState("");

  // --- API FUNKSIYALARI (O'zgarmadi) ---
  const handleAddProduct = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        "https://my-menu-backend-1.onrender.com/api/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...productForm,
            narxi: Number(String(productForm.narxi).replace(/\D/g, "")),
          }),
        },
      );
      if (res.ok) {
        setProductForm({
          nomi: "",
          title: "",
          narxi: "",
          category: "",
          rasmi: "",
        });
        setActiveTab("products");
        loadData(true);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddCategory = async (e) => {
    if (e) e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await fetch(
        "https://my-menu-backend-1.onrender.com/api/categories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nomi: newCatName }),
        },
      );
      if (res.ok) {
        setNewCatName("");
        loadData(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetArchive = useCallback(() => {
    if (
      window.confirm("Haqiqatdan ham barcha statistikani 0 qilmoqchimisiz?")
    ) {
      localStorage.removeItem("orders_archive");
      const currentIds = orders.map((o) => o._id || o.id);
      localStorage.setItem("ignored_order_ids", JSON.stringify(currentIds));
      setOrders([...orders]);
    }
  }, [orders]);

  const deleteItem = async (id, type) => {
    if (!window.confirm("Haqiqatdan ham o'chirilsinmi?")) return;
    try {
      const res = await fetch(
        `https://my-menu-backend-1.onrender.com/api/${type}/${id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) loadData(true);
    } catch (err) {
      console.error("O'chirishda xatolik:", err);
    }
  };

  const loadData = useCallback(async (isSilent = false) => {
    if (typeof window === "undefined") return;
    const auth = localStorage.getItem("is_admin_authenticated");
    if (auth !== "true") return;
    if (!isSilent) setLoading(true);
    try {
      const [oRes, pRes, cRes] = await Promise.all([
        fetch("https://my-menu-backend-1.onrender.com/api/orders").then((r) =>
          r.json(),
        ),
        fetch("https://my-menu-backend-1.onrender.com/api/products").then((r) =>
          r.json(),
        ),
        fetch("https://my-menu-backend-1.onrender.com/api/categories").then(
          (r) => r.json(),
        ),
      ]);
      const freshOrders = Array.isArray(oRes) ? oRes : oRes.orders || [];

      if (freshOrders.length > 0) {
        const existingArchive = JSON.parse(
          localStorage.getItem("orders_archive") || "[]",
        );
        const ignoredIds = JSON.parse(
          localStorage.getItem("ignored_order_ids") || "[]",
        );
        const newToArchive = freshOrders.filter((fo) => {
          const id = fo._id || fo.id;
          return (
            !ignoredIds.includes(id) &&
            !existingArchive.some((ao) => (ao._id || ao.id) === id)
          );
        });
        if (newToArchive.length > 0) {
          localStorage.setItem(
            "orders_archive",
            JSON.stringify([...existingArchive, ...newToArchive]),
          );
        }
      }
      setOrders(freshOrders);
      setProducts(Array.isArray(pRes) ? pRes : pRes.products || []);
      setCategories(Array.isArray(cRes) ? cRes : cRes.categories || []);
    } catch (err) {
      console.error("Yuklashda xato:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("is_admin_authenticated") === "true")
      setIsAdmin(true);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
      const interval = setInterval(() => loadData(true), 15000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, loadData]);

  const processedStats = useMemo(() => {
    const report = {
      kunlik: { summa: 0, count: 0, items: {}, sorted: [] },
      haftalik: { summa: 0, count: 0, items: {}, sorted: [] },
      oylik: { summa: 0, count: 0, items: {}, sorted: [] },
    };
    const archive =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("orders_archive") || "[]")
        : [];
    if (archive.length === 0) return report;

    const now = new Date();
    const getLocalISO = (d) => {
      const target = new Date(d);
      target.setMinutes(target.getMinutes() - target.getTimezoneOffset());
      return target.toISOString().split("T")[0];
    };
    const todayStr = getLocalISO(now);

    archive.forEach((order) => {
      let price = Number(order.totalPrice || order.summa || 0);
      const items = order.items || order.products || [];
      const oDate = new Date(order.date || order.createdAt || order.timestamp);
      const oKey = getLocalISO(isNaN(oDate.getTime()) ? now : oDate);
      const diffDays = Math.round(
        (new Date(todayStr).getTime() - new Date(oKey).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      const addData = (p) => {
        report[p].summa += price;
        report[p].count++;
        items.forEach((it) => {
          const name = it.nomi || it.name || "Noma'lum";
          const qty = Number(it.soni || it.quantity || it.count || 1);
          report[p].items[name] = (report[p].items[name] || 0) + qty;
        });
      };
      if (oKey === todayStr) addData("kunlik");
      if (diffDays >= 0 && diffDays <= 7) addData("haftalik");
      if (diffDays >= 0 && diffDays <= 30) addData("oylik");
    });

    ["kunlik", "haftalik", "oylik"].forEach((p) => {
      report[p].sorted = Object.entries(report[p].items)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty);
    });
    return report;
  }, [orders]);

  if (!isAdmin) return <LoginScreen setIsAdmin={setIsAdmin} />;

  // Sarlavha yordamchisi
  const getPageTitle = () => {
    switch (activeTab) {
      case "stats":
        return { label: "Analitika", icon: <LayoutDashboard size={18} /> };
      case "orders":
        return { label: "Buyurtmalar", icon: <ShoppingBag size={18} /> };
      case "products":
        return { label: "Mahsulotlar", icon: <Package size={18} /> };
      case "categories":
        return { label: "Kategoriyalar", icon: <Layers size={18} /> };
      case "add-product":
        return { label: "Yangi Mahsulot", icon: <PlusCircle size={18} /> };
      default:
        return { label: "Admin Panel", icon: <Sparkles size={18} /> };
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] text-slate-900 font-sans">
      <Sidebar
        activeTab={activeTab === "detailed-stats" ? "stats" : activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Yuqori Header - Modern & Glass */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-white/20 px-6 lg:px-10 flex items-center justify-between z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2.5 bg-white shadow-sm rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-indigo-600">
                {getPageTitle().icon}
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  Boshqaruv
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {getPageTitle().label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm"
                >
                  <Loader2 className="animate-spin text-indigo-500" size={14} />
                  <span className="text-[11px] font-medium text-slate-500">
                    Yangilanmoqda
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2.5 px-4 py-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 border border-indigo-500">
              <div className="relative">
                <BellRing size={14} className="text-white animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full border-2 border-indigo-600"></span>
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                Live System
              </span>
            </div>
          </div>
        </header>

        {/* Asosiy Content Area */}
        <div className="p-6 lg:p-10 flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [background-position:center]">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === "stats" && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <StatsView
                    data={processedStats[statsSubTab]}
                    subTab={statsSubTab}
                    setSubTab={setStatsSubTab}
                    onReset={handleResetArchive}
                    onDetailClick={() => setActiveTab("detailed-stats")}
                  />
                </motion.div>
              )}

              {activeTab === "detailed-stats" && (
                <motion.div
                  key="detailed"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                >
                  <DetailedStats
                    data={processedStats[statsSubTab]}
                    onBack={() => setActiveTab("stats")}
                  />
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
                >
                  <OrdersView
                    orders={orders}
                    onDelete={(id) => deleteItem(id, "orders")}
                  />
                </motion.div>
              )}

              {activeTab === "products" && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20"
                >
                  {products.map((p, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={p._id || p.id}
                    >
                      <ProductCard
                        item={p}
                        onDelete={(id) => deleteItem(id, "products")}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "add-product" && (
                <motion.div
                  key="add"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-5xl mx-auto"
                >
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                    <AddProductForm
                      form={productForm}
                      setForm={setProductForm}
                      categories={categories}
                      onSubmit={handleAddProduct}
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === "categories" && (
                <motion.div
                  key="cats"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl mx-auto"
                >
                  <CategoryManager
                    categories={categories}
                    onAdd={handleAddCategory}
                    onDelete={(id) => deleteItem(id, "categories")}
                    newCat={newCatName}
                    setNewCat={setNewCatName}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Global CSS for scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
