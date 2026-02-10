import { DollarSign, Package, ShoppingBag, Utensils } from "lucide-react";

const StatsCards = ({ stats, isDarkMode }) => {
  const cards = [
    {
      label: "Umumiy Savdo",
      val: `${stats.totalRevenue.toLocaleString()} uzs`,
      icon: DollarSign,
      color: "text-teal-600",
    },
    {
      label: "Buyurtmalar",
      val: `${stats.totalOrders} ta`,
      icon: Package,
      color: "text-blue-600",
    },
    {
      label: "Sotilganlar",
      val: `${stats.totalItems} dona`,
      icon: ShoppingBag,
      color: "text-orange-600",
    },
    {
      label: "Top Taom",
      val: stats.topDish,
      icon: Utensils,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((s, i) => (
        <div
          key={i}
          className={`p-6 rounded-[2rem] shadow-sm border transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
        >
          <s.icon className={`${s.color} mb-2`} size={20} />
          <p className="text-slate-400 text-[10px] font-bold uppercase">
            {s.label}
          </p>
          <h2 className="text-xl font-black truncate">{s.val}</h2>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
