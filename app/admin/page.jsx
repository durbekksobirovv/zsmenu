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

import { Loader2, Menu, Sparkles, BellRing } from "lucide-react";
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

  // --- API FUNKSIYALARI ---
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
      alert("Statistika tozalandi!");
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

  // --- STATISTIKA HISOBI ---
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
      // StatsView slice(0,10) qiladi, DetailedStats esa hammasini ko'rsatadi
    });
    return report;
  }, [orders]);

  if (!isAdmin) return <LoginScreen setIsAdmin={setIsAdmin} />;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar
        activeTab={activeTab === "detailed-stats" ? "stats" : activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu />
            </button>
            <h1 className="font-black text-slate-900 uppercase text-[10px] tracking-widest italic flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-500" />
              {activeTab.replace("-", " ")}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {loading && (
              <Loader2 className="animate-spin text-emerald-500" size={16} />
            )}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
              <BellRing size={12} className="text-emerald-600" />
              <span className="text-[9px] font-black text-emerald-700 uppercase italic tracking-widest">
                Live Active
              </span>
            </div>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20"
              >
                {products.map((p) => (
                  <ProductCard
                    key={p._id || p.id}
                    item={p}
                    onDelete={(id) => deleteItem(id, "products")}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === "add-product" && (
              <motion.div
                key="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AddProductForm
                  form={productForm}
                  setForm={setProductForm}
                  categories={categories}
                  onSubmit={handleAddProduct}
                />
              </motion.div>
            )}

            {activeTab === "categories" && (
              <motion.div
                key="cats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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
      </main>
    </div>
  );
}
