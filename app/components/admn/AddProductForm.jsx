import React from "react";
import {
  AlignLeft,
  DollarSign,
  Tag,
  ImageIcon,
  UploadCloud,
} from "lucide-react";

const FormInput = ({ label, icon: Icon, value, onChange, type = "text" }) => (
  <div className="space-y-3 flex-1">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">
      {label}
    </label>
    <div className="relative">
      <Icon
        className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500"
        size={18}
      />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 p-6 pl-14 rounded-[2rem] font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all shadow-inner"
      />
    </div>
  </div>
);

export const AddProductForm = ({ form, setForm, categories, onSubmit }) => (
  <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 pb-20">
    <div className="flex-1 bg-white p-12 rounded-[4rem] shadow-xl border border-white">
      <h2 className="text-3xl font-black text-slate-900 italic mb-10">
        Yangi Taom <span className="text-emerald-500">Yaratish</span>
      </h2>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormInput
            label="Nomi"
            icon={AlignLeft}
            value={form.nomi}
            onChange={(v) => setForm({ ...form, nomi: v })}
          />
          <FormInput
            label="Narxi (UZS)"
            icon={DollarSign}
            type="number"
            value={form.narxi}
            onChange={(v) => setForm({ ...form, narxi: v })}
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">
            Kategoriya
          </label>
          <select
            className="w-full bg-slate-50 p-6 rounded-[2rem] font-bold outline-none shadow-inner appearance-none"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Tanlang...</option>
            {categories.map((c) => (
              <option key={c._id} value={c.nomi}>
                {c.nomi}
              </option>
            ))}
          </select>
        </div>
        <FormInput
          label="Tavsif"
          icon={Tag}
          value={form.title}
          onChange={(v) => setForm({ ...form, title: v })}
        />
        <FormInput
          label="Rasm Manzili"
          icon={ImageIcon}
          value={form.rasmi}
          onChange={(v) => setForm({ ...form, rasmi: v })}
        />
        <button
          onClick={onSubmit}
          className="w-full bg-slate-900 text-white py-7 rounded-[2.5rem] font-black shadow-2xl hover:bg-emerald-600 transition-all active:scale-95 uppercase tracking-widest"
        >
          TAOMNI QO'SHISH
        </button>
      </div>
    </div>
    <div className="w-full lg:w-[400px]">
      <div className="bg-white rounded-[4rem] overflow-hidden shadow-2xl border border-white sticky top-32 p-4">
        <div className="h-64 bg-slate-100 flex items-center justify-center rounded-[3rem] overflow-hidden">
          {form.rasmi ? (
            <img
              src={form.rasmi}
              className="w-full h-full object-cover"
              alt="Preview"
            />
          ) : (
            <UploadCloud size={50} className="text-slate-200" />
          )}
        </div>
        <div className="p-8">
          <p className="text-[10px] font-black text-emerald-500 uppercase mb-2">
            {form.category || "Bo'lim"}
          </p>
          <h4 className="text-2xl font-black text-slate-900 mb-2 italic">
            {form.nomi || "Nomi"}
          </h4>
          <p className="text-slate-900 font-black">
            {Number(form.narxi || 0).toLocaleString()} so'm
          </p>
        </div>
      </div>
    </div>
  </div>
);
