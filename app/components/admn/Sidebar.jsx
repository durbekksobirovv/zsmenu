import {
  Activity,
  ShoppingCart,
  Package,
  PlusCircle,
  Layers,
  LogOut,
  X,
} from "lucide-react";

// Ichki yordamchi komponent (faqat shu fayl uchun)
const NavBtn = ({ id, icon: Icon, label, active, setActive, closeMobile }) => (
  <button
    onClick={() => {
      setActive(id);
      if (closeMobile) closeMobile(false);
    }}
    className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-black transition-all ${active === id ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 scale-[1.02]" : "hover:bg-white/5 hover:text-white"}`}
  >
    <Icon size={20} />
    <span className="uppercase tracking-widest text-[10px] italic">
      {label}
    </span>
  </button>
);

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => (
  <>
    {/* Mobil versiya uchun fon (Overlay) */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-[105] lg:hidden backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
    )}

    <aside
      className={`fixed inset-y-0 left-0 z-[110] w-72 bg-[#020617] text-slate-400 transition-all duration-500 lg:translate-x-0 lg:static ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-8 flex flex-col h-full">
        {/* Logo va Mobil yopish tugmasi */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-emerald-500/20">
              M
            </div>
            <span className="font-black text-xl text-white uppercase italic">
              FAST<span className="text-emerald-500">MENU</span>
            </span>
          </div>
          <button
            className="lg:hidden text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigatsiya */}
        <nav className="flex-1 space-y-2">
          <NavBtn
            id="stats"
            icon={Activity}
            label="Statistika"
            active={activeTab}
            setActive={setActiveTab}
            closeMobile={setIsOpen}
          />
          <NavBtn
            id="orders"
            icon={ShoppingCart}
            label="Zakazlar"
            active={activeTab}
            setActive={setActiveTab}
            closeMobile={setIsOpen}
          />
          <NavBtn
            id="products"
            icon={Package}
            label="Taomlar"
            active={activeTab}
            setActive={setActiveTab}
            closeMobile={setIsOpen}
          />
          <NavBtn
            id="add-product"
            icon={PlusCircle}
            label="Qo'shish"
            active={activeTab}
            setActive={setActiveTab}
            closeMobile={setIsOpen}
          />
          <NavBtn
            id="categories"
            icon={Layers}
            label="Bo'limlar"
            active={activeTab}
            setActive={setActiveTab}
            closeMobile={setIsOpen}
          />
        </nav>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="mt-auto flex items-center gap-3 p-5 text-slate-500 hover:text-red-400 bg-white/5 rounded-2xl font-bold transition-all"
        >
          <LogOut size={20} /> Chiqish
        </button>
      </div>
    </aside>
  </>
);
