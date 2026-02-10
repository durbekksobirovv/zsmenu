import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  BarChart3,
  Settings,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, isDarkMode, setIsDarkMode }) => {
  const menuItems = [
    { id: "orders", label: "Buyurtmalar", icon: <ShoppingBag size={20} /> },
    { id: "stats", label: "Statistika", icon: <BarChart3 size={20} /> },
    {
      id: "menu",
      label: "Menyu boshqaruvi",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "settings", label: "Sozlamalar", icon: <Settings size={20} /> },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform transform md:translate-x-0 -translate-x-full ${
        isDarkMode
          ? "bg-slate-900 border-r border-slate-800"
          : "bg-white border-r border-slate-100"
      }`}
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center text-white font-black text-xl">
            F
          </div>
          <span className="text-xl font-black tracking-tight">FoodAdmin</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                activeTab === item.id
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                  : isDarkMode
                    ? "text-slate-400 hover:bg-slate-800"
                    : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
              isDarkMode
                ? "bg-slate-800 text-yellow-400"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            {isDarkMode ? "Kunduzgi rejim" : "Tungi rejim"}
          </button>

          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all">
            <LogOut size={20} />
            Chiqish
          </button>
        </div>
      </div>
    </aside>
  );
};

// ENG MUHIM QISMI:
export default Sidebar;
