import { Phone, CheckCircle2 } from "lucide-react";

const OrdersList = ({ orders, updateStatus, archiveOrder, isDarkMode }) => {
  if (!orders || orders.length === 0)
    return (
      <div
        className={`text-center py-20 text-slate-400 rounded-3xl border-2 border-dashed ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}
      >
        Hozircha yangi buyurtmalar yo'q
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {orders.map((order) => (
        <div
          key={order._id || order.id}
          className={`rounded-3xl p-6 border transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100"}`}
        >
          <div className="mb-4">
            <h3 className="font-bold text-lg">
              {order.customerName || "Mijoz"}
            </h3>
            <a
              href={`tel:${order.customerPhone}`}
              className="text-teal-500 font-bold flex items-center gap-2 text-sm"
            >
              <Phone size={14} /> {order.customerPhone}
            </a>
          </div>
          <div
            className={`rounded-2xl p-4 space-y-2 mb-6 ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"}`}
          >
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {item.title}{" "}
                  <span className="text-teal-500 font-black">
                    x{item.quantity}
                  </span>
                </span>
                <span className="font-bold">
                  {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {order.status !== "Tayyor" ? (
              <button
                onClick={() => updateStatus(order._id || order.id, "Tayyor")}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> Tayyor
              </button>
            ) : (
              <div className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-center text-sm">
                Xabar yuborilgan ✅
              </div>
            )}
            <button
              onClick={() => archiveOrder(order._id || order.id)}
              className={`w-full py-3 rounded-xl font-bold ${isDarkMode ? "bg-slate-800 text-white" : "bg-teal-900 text-white"}`}
            >
              Yakunlash (Arxiv)
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;
