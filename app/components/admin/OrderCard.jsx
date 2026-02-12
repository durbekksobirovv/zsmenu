import React from "react";
import { Phone, CheckCircle2 } from "lucide-react";

const OrderCard = ({ order, updateStatus, archiveOrder, isDarkMode }) => {
  // Backenddan kelayotgan ID ni aniqlab olamiz
  const orderId = order.id || order._id;

  // app/components/admin/OrdersList.jsx
  const OrdersList = ({
    orders = [],
    updateStatus,
    archiveOrder,
    isDarkMode,
  }) => {
    // orders = [] - bu default qiymat, agar orders undefined kelsa, xato bermaydi

    if (!orders || orders.length === 0) {
      return (
        <div className={`text-center py-20 ...`}>Hozircha buyurtmalar yo'q</div>
      );
    }
    // ... qolgan kod
  };

  return (
    <div
      className={`rounded-3xl p-6 shadow-sm border transition-all ${
        isDarkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-100 text-slate-900"
      } ${order.status === "Tayyor" ? "border-green-500/50 bg-green-500/5" : ""}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{order.customerName || "Mijoz"}</h3>
          <a
            href={`tel:${order.customerPhone}`}
            className="text-teal-500 font-bold flex items-center gap-2 text-sm"
          >
            <Phone size={14} /> {order.customerPhone}
          </a>
        </div>
        {order.status === "Tayyor" && (
          <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">
            Tayyor
          </span>
        )}
      </div>

      <div
        className={`border rounded-2xl p-4 space-y-2 mb-6 ${
          isDarkMode
            ? "bg-slate-800/50 border-slate-700"
            : "bg-slate-50 border-slate-100"
        }`}
      >
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className={isDarkMode ? "text-slate-300" : "text-slate-600"}>
              {item.title}{" "}
              <span className="text-teal-500 font-black">x{item.quantity}</span>
            </span>
            <span className="font-bold">
              {(Number(item.price) * item.quantity).toLocaleString()} so'm
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {/* "Tayyor (Xabar yuborish)" tugmasi */}
        {order.status !== "Tayyor" ? (
          <button
            onClick={() => updateStatus(orderId, "Tayyor")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <CheckCircle2 size={18} /> Tayyor (Xabar yuborish)
          </button>
        ) : (
          <div className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2">
            Xabar yuborilgan <CheckCircle2 size={18} />
          </div>
        )}

        {/* "Yakunlash (Arxiv)" tugmasi */}
        <button
          onClick={() => archiveOrder(orderId)}
          className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 ${
            isDarkMode
              ? "bg-slate-800 hover:bg-black text-white"
              : "bg-teal-900 hover:bg-black text-white"
          }`}
        >
          Yakunlash (Arxiv)
        </button>
      </div>
    </div>
  );
};;

export default OrderCard;
