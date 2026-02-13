"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingBasket,
  User,
  Plus,
  Minus,
  Check,
  Trash2,
  Loader2,
  Phone,
  X,
  Heart,
  ClipboardList,
  MapPin,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- MAHSULOT KARTASI ---
const FoodCard = ({ food, onToggle, basketItem }) => {
  const [showHeart, setShowHeart] = useState(false);
  const quantity = basketItem ? basketItem.quantity : 0;

  const handleDoubleClick = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-[1.5rem] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      <div
        className="relative h-32 w-full overflow-hidden cursor-pointer"
        onDoubleClick={handleDoubleClick}
      >
        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6 }}
          src={food.rasmi || "https://via.placeholder.com/300"}
          alt={food.nomi}
          className="w-full h-full object-cover"
        />
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-10 bg-black/10"
            >
              <Heart
                size={40}
                className="text-white fill-red-500 stroke-red-500"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
        <div>
          <h3 className="font-bold text-[14px] text-gray-800 leading-tight line-clamp-1">
            {food.nomi}
          </h3>
          <p className="text-[10px] text-gray-400 line-clamp-1">
            {food.title || "Mazali taom"}
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#167472]">
              {Number(food.narxi).toLocaleString()}
            </span>
            <span className="text-[9px] font-bold text-[#167472] uppercase">
              so'm
            </span>
          </div>
          <div className="h-10 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {quantity === 0 ? (
                <motion.button
                  key="add-btn"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  onClick={() => onToggle(food, "increase")}
                  className="w-full h-full bg-[#167472] text-white rounded-xl flex items-center justify-center gap-1 font-bold text-[11px] active:scale-95 transition-transform"
                >
                  <ShoppingBasket size={14} /> Qo'shish
                </motion.button>
              ) : (
                <motion.div
                  key="qty-control"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-between p-0.5 border border-gray-100"
                >
                  <button
                    onClick={() => onToggle(food, "decrease")}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#167472] shadow-sm active:scale-90"
                  >
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <span className="font-black text-[13px] text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => onToggle(food, "increase")}
                    className="w-8 h-8 bg-[#167472] rounded-lg flex items-center justify-center text-white shadow-sm active:scale-90"
                  >
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- ASOSIY SAHIFA ---
const MenuPage = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState(["Barchasi"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Barchasi");
  const [basket, setBasket] = useState([]);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+998");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fRes, cRes] = await Promise.all([
          fetch("https://my-menu-backend-1.onrender.com/api/products"),
          fetch("https://my-menu-backend-1.onrender.com/api/categories"),
        ]);
        const fData = await fRes.json();
        setFoods(fData);
        if (cRes.ok) {
          const cData = await cRes.json();
          setCategories(["Barchasi", ...cData.map((c) => c.nomi)]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPrice = basket.reduce(
    (sum, item) => sum + item.narxi * item.quantity,
    0,
  );

  const filtered = (Array.isArray(foods) ? foods : []).filter(
    (f) =>
      (selectedCategory === "Barchasi" || f.category === selectedCategory) &&
      f.nomi?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleBasketUpdate = (f, action) => {
    setBasket((prev) => {
      const exists = prev.find((i) => i._id === f._id);
      if (action === "increase") {
        if (exists)
          return prev.map((i) =>
            i._id === f._id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        return [...prev, { ...f, quantity: 1 }];
      }
      if (action === "decrease") {
        if (exists?.quantity > 1)
          return prev.map((i) =>
            i._id === f._id ? { ...i, quantity: i.quantity - 1 } : i,
          );
        return prev.filter((i) => i._id !== f._id);
      }
      return prev;
    });
  };

  // Telefon raqami uchun maxsus handler
  const handlePhoneChange = (e) => {
    const val = e.target.value;
    // Faqat "+" bilan boshlanishi va keyin raqamlar bo'lishini ta'minlash
    if (val.startsWith("+998") && val.length <= 13) {
      const onlyNums = val.slice(1); // "+" ni olib tashlab tekshiramiz
      if (/^\d*$/.test(onlyNums)) {
        setPhoneNumber(val);
      }
    }
  };

  const sendOrder = async () => {
    if (phoneNumber.length < 13)
      return alert("Raqamni to'liq kiriting (+998XXXXXXXXX)");
    setSending(true);
    try {
      const res = await fetch(
        "https://my-menu-backend-1.onrender.com/api/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: basket,
            totalPrice,
            phone: phoneNumber,
            status: "Yangi",
          }),
        },
      );
      if (res.ok) {
        setBasket([]);
        setIsBasketOpen(false);
        setShowPhoneModal(false);
        setShowSuccess(true);
      }
    } catch (e) {
      alert("Xato yuz berdi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex justify-center bg-[#F8FAFC] min-h-screen font-sans selection:bg-[#167472]/20">
      <div className="w-full max-w-[450px] bg-white shadow-2xl min-h-screen flex flex-col relative overflow-hidden">
        {/* HEADER */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <header className="px-5 pt-4 pb-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Xush kelibsiz
                </p>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">
                  Z.s <span className="text-[#167472]">Menyu</span>
                </h1>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsInfoModalOpen(true)}
                className="w-12 h-12 bg-[#167472] rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-emerald-500/20 active:bg-[#0e4d4b] transition-colors"
              >
                Z
              </motion.button>
            </div>

            <div className="relative group mb-2">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Taom qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-xl py-2.5 pl-11 pr-4 outline-none text-sm text-black focus:bg-white border-2 border-transparent focus:border-[#167472]/10 transition-all"
              />
            </div>
          </header>
          <div className="flex gap-2 overflow-x-auto w-full no-scrollbar px-5 py-3">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-[#167472] text-white shadow-md shadow-[#167472]/20"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <Loader2 className="animate-spin text-[#167472] mb-2" size={32} />
              <p className="font-bold text-gray-400">Yuklanmoqda...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((food) => (
                  <FoodCard
                    key={food._id}
                    food={food}
                    basketItem={basket.find((i) => i._id === food._id)}
                    onToggle={handleBasketUpdate}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>

        {/* BOTTOM NAV */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-black/90 backdrop-blur-xl rounded-2xl p-3 flex justify-around items-center z-50 shadow-2xl border border-white/10">
          <button className="flex flex-col items-center text-white space-y-1">
            <ClipboardList size={18} className="text-[#167472]" />
            <span className="text-[9px] font-medium">Menyu</span>
          </button>
          <button
            onClick={() => setIsBasketOpen(true)}
            className="flex flex-col items-center text-gray-400 hover:text-white"
          >
            <div className="relative">
              <ShoppingBasket
                size={18}
                className={basket.length > 0 ? "text-orange-500" : ""}
              />
              {basket.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {basket.length}
                </span>
              )}
            </div>
            <span className="text-[9px] font-medium">Savat</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 hover:text-white">
            <User size={18} />
            <span className="text-[9px] font-medium">Profil</span>
          </button>
        </nav>

        {/* MODALLAR */}

        {/* 1. RESTORAN INFO MODAL */}
        <AnimatePresence>
          {isInfoModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsInfoModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-[340px] rounded-[2.5rem] p-8 relative z-10 overflow-hidden shadow-2xl"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#167472] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#167472]/20">
                    <span className="text-4xl font-black text-white">Z</span>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">
                    Z.s Restoran
                  </h2>
                  <p className="text-xs text-gray-400 mb-6 font-bold tracking-widest uppercase">
                    Premium Quality
                  </p>

                  <div className="space-y-4 mb-8 text-left bg-gray-50 p-5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-[#167472]" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          Ish vaqti
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          09:00 — 23:00
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-[#167472]" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          Manzil
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          Toshkent, O'zbekiston
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsInfoModalOpen(false)}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-transform"
                  >
                    Tushunarli
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 2. BASKET MODAL */}
        <AnimatePresence>
          {isBasketOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsBasketOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 z-[70] w-full max-w-[450px] mx-auto bg-white rounded-t-[2rem] shadow-2xl flex flex-col max-h-[90vh]"
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2" />
                <div className="p-6 overflow-y-auto no-scrollbar">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-gray-900">Savat</h2>
                    <button
                      onClick={() => setIsBasketOpen(false)}
                      className="p-2 bg-gray-100 rounded-full text-gray-500"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  {basket.length === 0 ? (
                    <div className="text-center py-16 opacity-30">
                      <ShoppingBasket size={48} className="mx-auto mb-4" />
                      <p className="font-bold">Savatingiz bo'sh</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {basket.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100"
                        >
                          <img
                            src={item.rasmi}
                            className="w-16 h-16 rounded-xl object-cover"
                            alt=""
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-[13px] text-gray-800 line-clamp-1">
                              {item.nomi}
                            </h4>
                            <p className="text-[#167472] font-black text-xs">
                              {(item.narxi * item.quantity).toLocaleString()}{" "}
                              so'm
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() =>
                                  handleBasketUpdate(item, "decrease")
                                }
                                className="w-7 h-7 flex items-center justify-center bg-white rounded-lg border"
                              >
                                {item.quantity === 1 ? (
                                  <Trash2 size={12} className="text-red-500" />
                                ) : (
                                  <Minus size={12} />
                                )}
                              </button>
                              <span className="font-bold text-xs">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleBasketUpdate(item, "increase")
                                }
                                className="w-7 h-7 flex items-center justify-center bg-[#167472] text-white rounded-lg"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {basket.length > 0 && (
                  <div className="p-5 border-t bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400 font-bold text-[10px] uppercase">
                        Jami:
                      </span>
                      <span className="text-lg font-black text-[#167472]">
                        {totalPrice.toLocaleString()} so'm
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsBasketOpen(false);
                        setShowPhoneModal(true);
                      }}
                      className="w-full bg-[#167472] text-white py-3.5 rounded-xl font-black shadow-lg"
                    >
                      Buyurtma berish
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 3. PHONE MODAL - 13 RAQAM CHEKLOVI BILAN */}
        <AnimatePresence>
          {showPhoneModal && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPhoneModal(false)}
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-[320px] rounded-[2rem] p-6 relative z-10 text-center"
              >
                <div className="w-14 h-14 bg-[#167472]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#167472]">
                  <Phone size={28} />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">
                  Telefon raqam
                </h3>
                <p className="text-[10px] text-gray-400 mb-4 font-bold uppercase">
                  Faqat 13 ta belgi
                </p>
                <input
                  type="tel"
                  maxLength={13} // 13 ta belgi cheklovi
                  value={phoneNumber}
                  onChange={handlePhoneChange} // Maska funksiyasi
                  className="w-full bg-gray-100 rounded-xl py-3 px-4 text-center text-base font-bold outline-none mb-6 border-2 border-transparent focus:border-[#167472]/20"
                />
                <button
                  onClick={sendOrder}
                  disabled={sending}
                  className="w-full bg-[#167472] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  {sending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Tasdiqlash"
                  )}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 4. SUCCESS MODAL */}
        <AnimatePresence>
          {showSuccess && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-6 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#167472]"
              />
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 text-white"
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} strokeWidth={4} />
                </div>
                <h2 className="text-2xl font-black mb-2">Qabul qilindi!</h2>
                <p className="opacity-80 text-sm mb-8">
                  Tez orada operatorimiz bog'lanadi.
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="bg-white text-[#167472] px-8 py-3 rounded-xl font-black"
                >
                  Yopish
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MenuPage;
