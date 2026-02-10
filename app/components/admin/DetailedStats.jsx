const DetailedStats = ({ stats, isDarkMode }) => (
  <div
    className={`rounded-[2.5rem] border overflow-hidden transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
  >
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr
            className={`text-[10px] uppercase font-black ${isDarkMode ? "bg-slate-800/30 text-slate-500" : "bg-slate-50 text-slate-400"}`}
          >
            <th className="px-8 py-4">Taom</th>
            <th className="px-8 py-4 text-center">Sotilgan</th>
            <th className="px-8 py-4 text-right">Tushum</th>
          </tr>
        </thead>
        <tbody
          className={`divide-y ${isDarkMode ? "divide-slate-800" : "divide-slate-100"}`}
        >
          {stats.detailedStats.map(([title, data], index) => (
            <tr
              key={index}
              className={`transition-colors ${isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50/50"}`}
            >
              <td className="px-8 py-5 font-bold">{title}</td>
              <td className="px-8 py-5 text-center">
                <span className="bg-teal-500/10 text-teal-500 px-3 py-1 rounded-lg font-black text-sm">
                  {data.quantity} ta
                </span>
              </td>
              <td className="px-8 py-5 text-right font-black">
                {data.totalSum.toLocaleString()} so'm
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DetailedStats;
