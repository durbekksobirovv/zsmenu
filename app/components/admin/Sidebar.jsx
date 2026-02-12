import {
  LayoutDashboard,
  Package,
  Utensils,
  Tag,
  BarChart3,
  LogOut,
} from "lucide-react";

const Sidebar = ({
  activeTab,
  setActiveTab,
  setIsAuthenticated,
  isDarkMode,
}) => {
  const menuItems = [
    { id: "orders", icon: Package, label: "Buyurtmalar" },
    { id: "menu", icon: Utensils, label: "Taomlar Menusi" },
    { id: "categories", icon: Tag, label: "Kategoriyalar" },
    { id: "stats", icon: BarChart3, label: "Statistika" },
  ];

  return (
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
        {menuItems.map((item) => (
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
  );
};

export default Sidebar;
