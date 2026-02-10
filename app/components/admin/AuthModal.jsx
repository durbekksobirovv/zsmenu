"use client";
import React, { useState, useEffect } from "react";
import { X, Upload, ImageIcon } from "lucide-react";

const ProductModal = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  isDarkMode,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    } else {
      setFormData({ title: "", price: "", description: "", image: "" });
    }
  }, [editingProduct, isOpen]);

  // Rasmni o'qish va Base64 ga o'tkazish funksiyasi
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl ${isDarkMode ? "bg-slate-900 border border-slate-800" : "bg-white"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">
            {editingProduct ? "Tahrirlash" : "Yangi mahsulot"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Rasm yuklash maydoni */}
          <div className="relative group">
            <label
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
                formData.image
                  ? "border-teal-500/50"
                  : "border-slate-700 hover:border-teal-500/50"
              } ${isDarkMode ? "bg-slate-800/50" : "bg-slate-50"}`}
            >
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-[1.4rem]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-slate-500" />
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Rasm yuklash
                  </p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
            {formData.image && (
              <button
                onClick={() => setFormData({ ...formData, image: "" })}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Nomi"
            className={`w-full p-4 rounded-2xl border outline-none font-bold ${isDarkMode ? "bg-slate-800 border-slate-700 focus:border-teal-500" : "bg-slate-50 border-slate-100 focus:border-teal-500"}`}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Narxi"
            className={`w-full p-4 rounded-2xl border outline-none font-bold ${isDarkMode ? "bg-slate-800 border-slate-700 focus:border-teal-500" : "bg-slate-50 border-slate-100 focus:border-teal-500"}`}
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />

          <textarea
            placeholder="Tavsif"
            rows="3"
            className={`w-full p-4 rounded-2xl border outline-none font-medium ${isDarkMode ? "bg-slate-800 border-slate-700 focus:border-teal-500" : "bg-slate-50 border-slate-100 focus:border-teal-500"}`}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <button
            onClick={() => onSave(formData)}
            className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-black shadow-lg shadow-teal-500/30 transition-all active:scale-[0.98]"
          >
            {editingProduct ? "Saqlash" : "Qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
