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
  Phone,
  UserCircle,
} from "lucide-react";

const API_BASE_URL = "https://food-ordering-api-aapf.onrender.com/api";

const FoodCard = ({ food, onToggle, isAdded }) => {
  const [showHeart, setShowHeart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleDoubleClick = () => {
    setIsLiked(!isLiked);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm animate-in fade-in zoom-in duration-300 border border-gray-50">
      <div
        className="relative h-32 w-full cursor-pointer select-none"
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={food.img}
          alt={food.title}
          className="w-full h-full rounded-t-xl object-cover shadow-sm"
        />
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center z-10 animate-bounce">
            <Heart
              size={40}
              className={`${isLiked ? "text-red-500 fill-red-500" : "text-gray-400 fill-gray-400"} drop-shadow-lg`}
            />
          </div>
        )}
        <button
          onClick={() => onToggle(food)}
          className={`absolute -top-1 -right-1 p-1.5 rounded-full transition-all duration-300 shadow-md border-2 border-white z-20 
          ${isAdded ? "bg-orange-500 text-white scale-110" : "bg-teal-800 text-white active:scale-95"}`}
        >
          {isAdded ? (
            <Check size={16} strokeWidth={3} />
          ) : (
            <Plus size={16} strokeWidth={3} />
          )}
        </button>
      </div>
      <div className="px-3 pb-4 pt-2">
        <h3 className="font-bold text-gray-800 text-xs mb-1 truncate">
          {food.title}
        </h3>
        <div className="flex items-center gap-2 mb-2 text-[9px] font-bold text-gray-400">
          <div className="flex items-center text-teal-600 italic">
            <Clock size={10} className="mr-1" /> {food.time}
          </div>
          <div className="flex items-center text-orange-500">
            <Star size={10} className="mr-1 fill-orange-400" /> {food.rating}
          </div>
        </div>
        <div className="text-sm font-black text-gray-900">
          {food.price?.toLocaleString()} so'm
        </div>
      </div>
    </div>
  );
};

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Barchasi");
  const [basket, setBasket] = useState([]);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("idle");
  const [foods, setFoods] = useState([]);

  // KATEGORIYALARNI DINAMIK HOLATGA KELTIRAMIZ
  const [dynamicCategories, setDynamicCategories] = useState(["Barchasi"]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const fetchFoods = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/foods`);
      if (res.ok) {
        const data = await res.json();
        setFoods(data);

        // --- DINAMIK KATEGORIYA YARATISH ---
        // Mavjud taomlardan barcha kategoriyalarni yig'ib olamiz
        const uniqueCats = [
          "Barchasi",
          ...new Set(data.map((item) => item.category)),
        ];
        setDynamicCategories(uniqueCats);
      }
    } catch (error) {
      console.error("Serverga ulanishda xato:", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleOrder = async () => {
    if (basket.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Iltimos, ismingiz va telefon raqamingizni kiriting!");
      return;
    }

    setOrderStatus("loading");
    const newOrder = {
      customerName,
      customerPhone,
      items: basket.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
      total: basket.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toLocaleString(),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (res.ok) {
        setOrderStatus("success");
        setBasket([]);
        setCustomerName("");
        setCustomerPhone("");
        setTimeout(() => {
          setIsBasketOpen(false);
          setOrderStatus("idle");
        }, 3000);
      }
    } catch (error) {
      alert("Xatolik!");
      setOrderStatus("idle");
    }
  };

  const toggleBasket = (food) => {
    setBasket((prev) => {
      const existing = prev.find((item) => item.id === food.id);
      if (existing) return prev.filter((item) => item.id !== food.id);
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setBasket((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
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
      <div className="w-full max-w-[450px] bg-white shadow-2xl h-[100vh] flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          <div className="p-6 pb-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-black text-gray-800">Menyu</h1>
              <div className="p-2 bg-gray-100 rounded-xl">
                <User size={24} />
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
                className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 outline-none"
              />
            </div>
          </div>

          {/* DINAMIK KATEGORIYALAR FILTRI */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 py-3 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
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

          <div className="bg-[#b7d5d4] min-h-full rounded-t-[3rem] p-6 pt-8">
            <div className="grid grid-cols-2 gap-4">
              {filteredFoods.map((food, index) => (
                <FoodCard
                  key={food.id || index}
                  food={food}
                  onToggle={toggleBasket}
                  isAdded={basket.some((i) => i.id === food.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM NAV & BASKET MODAL (O'zgarishsiz qoldi) */}
        {/* ... (Bu qismlar sizning original kodingiz bilan bir xil) ... */}

        <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t p-4 flex justify-around items-center z-40">
          <button className="flex flex-col items-center gap-1 text-teal-800 font-bold">
            <ClipboardList size={22} />{" "}
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
                <span className="absolute -top-2 -right-2 bg-orange-500 text-[9px] text-white w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {basket.length}
                </span>
              )}
            </div>
            <span className="text-[10px]">Savat</span>
          </button>
       
        </div>

        {isBasketOpen && (
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end"
            onClick={() => orderStatus === "idle" && setIsBasketOpen(false)}
          >
            <div
              className="w-full bg-white rounded-t-[2.5rem] p-6 shadow-2xl max-h-[90%] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {orderStatus === "success" ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-2xl font-black text-center">
                    QABUL QILINDI!
                  </h2>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black">Savat</h2>
                    <button
                      onClick={() => setIsBasketOpen(false)}
                      className="p-2 bg-gray-100 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                    {basket.length === 0 ? (
                      <div className="text-center py-10 text-gray-300">
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
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 bg-white rounded shadow-sm"
                              >
                                -
                              </button>
                              <span className="text-xs font-black">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 bg-white rounded shadow-sm"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setBasket((prev) =>
                                prev.filter((i) => i.id !== item.id),
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
                          Jami summa:
                        </span>
                        <span className="text-xl font-black text-teal-900">
                          {basket
                            .reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0,
                            )
                            .toLocaleString()}{" "}
                          so'm
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
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
                          onChange={(e) => setCustomerPhone(e.target.value)}
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
