"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CoinChartProps {
  history: { prices: [number, number][] }; // Data dari API
}

export default function CoinChart({ history }: CoinChartProps) {
  // 1. Format data agar mudah dibaca Recharts
  const data = history.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    }),
    price: price,
  }));

  return (
    <div className="h-[300px] w-full mt-8 p-4 border border-slate-800 rounded-xl bg-slate-900/30">
      <h3 className="text-slate-400 font-mono text-sm mb-4">
        /// PRICE HISTORY (7 DAYS)
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            stroke="#475569"
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />

          <YAxis
            hide // Sembunyikan angka Y-Axis agar bersih
            domain={["auto", "auto"]} // Skala otomatis menyesuaikan harga
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#1e293b",
              color: "#fff",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#10b981" }}
            formatter={(value: any) => [`$${value.toLocaleString()}`, "Price"]}
          />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
