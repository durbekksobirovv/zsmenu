"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingBasket,
  Clock,
  Star,
  Heart,
  ClipboardList,
  User,
  Plus,
  Check,
  X,
  Trash2,
  CheckCircle2,
  BellRing,
} from "lucide-react";
import Link from "next/link";

const API_BASE_URL = "https://food-ordering-api-1-6t2z.onrender.com/api";

// --- FOOD CARD KOMPONENTI ---
const FoodCard = ({ food, onUpdate, quantity }) => {


  return (
    <div className="bg-white rounded-xl shadow-sm animate-in fade-in zoom-in duration-300 border border-gray-50 flex flex-col">
      <div className="relative h-32 sm:h-40 w-full cursor-pointer select-none">
        <img
          src={food.img || null} // "" o'rniga null o'tadi va brauzer xato bermaydi
          alt={food.title}
          className="w-full h-40 rounded-2xl object-cover mb-4"
        />

        {/* PLUS/MINUS MANTIQI */}
        <div className="absolute -top-1 -right-1 z-20">
          {quantity > 0 ? (
            <div className="flex items-center bg-orange-500 text-white rounded-full shadow-md border-2 border-white transition-all duration-300 overflow-hidden">
              <button
                onClick={() => onUpdate(food.id, -1)}
                className="p-1.5 hover:bg-orange-600 active:scale-90 transition-transform"
              >
                <span className="text-sm font-black w-4 h-4 flex items-center justify-center">
                  -
                </span>
              </button>

              <span className="px-1 text-[11px] font-black min-w-[18px] text-center">
                {quantity}
              </span>

              <button
                onClick={() => onUpdate(food.id, 1)}
                className="p-1.5 hover:bg-orange-600 active:scale-90 transition-transform"
              >
                <Plus size={14} strokeWidth={4} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onUpdate(food.id, 1)}
              className="bg-teal-800 text-white p-1.5 rounded-full transition-all duration-300 shadow-md border-2 border-white active:scale-95"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      <div className="px-3 pb-4 pt-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-800 text-xs sm:text-sm mb-1 truncate">
            {food.title}
          </h3>
          <div className="flex items-center gap-2 mb-2 text-[9px] sm:text-[10px] font-bold text-gray-400">
            <div className="flex items-center text-teal-600 italic">
              <Clock size={10} className="mr-1" /> {food.time}
            </div>
            <div className="flex items-center text-orange-500">
              <Star size={10} className="mr-1 fill-orange-400" /> {food.rating}
            </div>
          </div>
        </div>
        <div className="text-sm sm:text-base font-black text-gray-900">
          {food.price?.toLocaleString()} so'm
        </div>
      </div>
    </div>
  );
};

// --- ASOSIY SAHIFA ---
const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Barchasi");
  const [basket, setBasket] = useState([]);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("idle");
  const [foods, setFoods] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState(["Barchasi"]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+998");
  const [lastOrderId, setLastOrderId] = useState(null);
  const [showOrderReadyModal, setShowOrderReadyModal] = useState(false);

  const fetchFoods = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/foods`);
      if (res.ok) {
        const data = await res.json();
        setFoods(data);
        const uniqueCats = [
          "Barchasi",
          ...new Set(data.map((item) => item.category)),
        ];
        setDynamicCategories(uniqueCats);
      }
    } catch (error) {
      console.error("Xato:", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Admin polling mantiqi
  useEffect(() => {
    let interval;
    if (lastOrderId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/orders`);
          if (res.ok) {
            const allOrders = await res.json();
            const myOrder = allOrders.find(
              (o) => (o.id || o._id) === lastOrderId,
            );
            if (myOrder && myOrder.status === "Tayyor") {
              setShowOrderReadyModal(true);
              setLastOrderId(null);
              clearInterval(interval);
            }
          }
        } catch (e) {
          console.error("Status tekshirishda xato:", e);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [lastOrderId]);

  // Savatdagi sonni o'zgartirish (Card va Savat uchun umumiy)
  const handleQuantityChange = (id, delta) => {
    setBasket((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) return prev.filter((item) => item.id !== id);
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item,
        );
      } else if (delta > 0) {
        const foodToAdd = foods.find((f) => f.id === id);
        return [...prev, { ...foodToAdd, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleOrder = async () => {
    if (
      basket.length === 0 ||
      !customerName.trim() ||
      customerPhone.length < 13
    ) {
      alert("Ma'lumotlarni to'liq kiriting!");
      return;
    }
    setOrderStatus("loading");
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          items: basket.map((i) => ({
            title: i.title,
            quantity: i.quantity,
            price: i.price,
          })),
          total: basket.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ),
          status: "Kutilmoqda",
          date: new Date().toLocaleString(),
        }),
      });
      if (res.ok) {
        const result = await res.json();
        setLastOrderId(result.id || result._id);
        setOrderStatus("success");
        setBasket([]);
        setCustomerName("");
        setCustomerPhone("+998");
        setTimeout(() => {
          setIsBasketOpen(false);
          setOrderStatus("idle");
        }, 2000);
      }
    } catch (e) {
      setOrderStatus("idle");
    }
  };

  const filteredFoods = foods.filter((f) => {
    const matchesCategory =
      selectedCategory === "Barchasi" || f.category === selectedCategory;
    const matchesSearch = f.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex justify-center bg-gray-200 min-h-screen">
      <div className="w-full max-w-5xl bg-white shadow-2xl h-[100vh] flex flex-col relative overflow-hidden">
        {/* TEPADAGI STATUS XABARI */}
        {lastOrderId && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] w-max animate-bounce">
            <div className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border-2 border-white">
              <Clock size={16} className="animate-spin" />
              <span className="text-xs font-black uppercase">
                Buyurtmangiz tayyorlanmoqda...
              </span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          {/* Header */}
          <div className="p-6 pb-2 max-w-2xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-black text-gray-800 italic">
                FOOD<span className="text-orange-500">FAST</span>
              </h1>
              <div className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer">
                <Link href={"/admin"}>
                  <User size={24} />
                </Link>
              </div>
            </div>
            <div className="relative mb-2">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                size={20}
              />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 outline-none focus:ring-2 ring-teal-500/20 font-bold"
              />
            </div>
          </div>

          {/* Kategoriyalar */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 py-3 border-b border-gray-100 flex justify-center">
            <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-3xl">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border
                    ${selectedCategory === cat ? "bg-teal-800 text-white border-teal-800" : "bg-white text-gray-400 border-gray-100"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Food Grid */}
          <div className="bg-[#b7d5d4] min-h-full rounded-t-[2.5rem] sm:rounded-t-[4rem] p-6 pt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {filteredFoods.map((food, index) => {
                const basketItem = basket.find((i) => i.id === food.id);
                return (
                  <FoodCard
                    key={food.id || index}
                    food={food}
                    onUpdate={handleQuantityChange}
                    quantity={basketItem ? basketItem.quantity : 0}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* MODALLAR VA NAVIGATSIYA (Sizning kodingiz bilan bir xil) */}
        {showOrderReadyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-teal-900/60 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl flex flex-col items-center text-center animate-in zoom-in border-4 border-orange-500">
              <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-white">
                <BellRing size={50} className="animate-ring" />
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">
                BUYURTMANGIZ TAYYOR!
              </h2>
              <p className="text-gray-500 font-bold mb-8">
                Yoqimli ishtaha! 😋
              </p>
              <button
                onClick={() => setShowOrderReadyModal(false)}
                className="w-full py-4 bg-teal-900 text-white rounded-[2rem] font-black text-lg"
              >
                RAHMAT
              </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t p-4 flex justify-around items-center z-40">
          <div className="flex justify-around w-full max-w-md mx-auto">
            <button className="flex flex-col items-center gap-1 text-teal-800 font-bold">
              <ClipboardList size={22} />
              <span className="text-[10px]">Menyu</span>
            </button>
            <button
              onClick={() => setIsBasketOpen(true)}
              className="flex flex-col items-center gap-1 relative text-gray-400"
            >
              <div className="relative">
                <ShoppingBasket
                  size={24}
                  className={basket.length > 0 ? "text-orange-500" : ""}
                />
                {basket.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-[9px] text-white w-5 h-5 flex items-center justify-center rounded-full animate-bounce font-bold">
                    {basket.length}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Savat</span>
            </button>
          </div>
        </div>

        {/* SAVAT MODALI */}
        {isBasketOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end items-center"
            onClick={() => orderStatus === "idle" && setIsBasketOpen(false)}
          >
            <div
              className="w-full max-w-lg bg-white rounded-t-[2.5rem] p-6 shadow-2xl max-h-[90%] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {orderStatus === "success" ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-2xl font-black text-center text-gray-800 italic uppercase">
                    Qabul qilindi!
                  </h2>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-gray-800">Savat</h2>
                    <button
                      onClick={() => setIsBasketOpen(false)}
                      className="p-2 bg-gray-100 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                    {basket.length === 0 ? (
                      <div className="text-center py-10 text-gray-300 font-bold">
                        Savat bo'sh 🛒
                      </div>
                    ) : (
                      basket.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-white"
                        >
                          <img
                            src={item.img}
                            className="w-14 h-14 rounded-xl object-cover"
                            alt=""
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs truncate">
                              {item.title}
                            </h4>
                            <p className="text-teal-700 font-black text-[10px]">
                              {item.price?.toLocaleString()} so'm
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, -1)
                                }
                                className="w-7 h-7 bg-white rounded shadow-sm font-bold border border-gray-100"
                              >
                                -
                              </button>
                              <span className="text-xs font-black">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="w-7 h-7 bg-white rounded shadow-sm font-bold border border-gray-100"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setBasket((p) =>
                                p.filter((i) => i.id !== item.id),
                              )
                            }
                            className="text-red-300 p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  {basket.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400 text-xs font-black uppercase">
                          Jami:
                        </span>
                        <span className="text-xl font-black text-teal-900">
                          {basket
                            .reduce((s, i) => s + i.price * i.quantity, 0)
                            .toLocaleString()}{" "}
                          so'm
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        <input
                          type="text"
                          placeholder="Ismingiz"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-gray-50 p-3 rounded-xl outline-none text-sm font-bold border border-teal-50"
                        />
                        <input
                          type="text"
                          placeholder="Telefoningiz"
                          value={customerPhone}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.startsWith("+998")) {
                              const digitsOnly = val
                                .slice(4)
                                .replace(/\D/g, "");
                              if (digitsOnly.length <= 9)
                                setCustomerPhone("+998" + digitsOnly);
                            }
                          }}
                          className="w-full bg-gray-50 p-3 rounded-xl outline-none text-sm font-black border border-teal-50"
                        />
                      </div>
                      <button
                        onClick={handleOrder}
                        disabled={orderStatus === "loading"}
                        className="w-full py-4 rounded-[2rem] font-black text-lg bg-teal-900 text-white active:scale-95 shadow-xl"
                      >
                        {orderStatus === "loading"
                          ? "YUBORILMOQDA..."
                          : "TASDIQLASH"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
