"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Legend,
} from "recharts";
import { format } from "date-fns";

interface CoinChartProps {
  history: {
    prices: [number, number][]; // [timestamp, price]
  };
}

export default function CoinChart({ history }: CoinChartProps) {
  // State Toggle Indikator
  const [indicators, setIndicators] = useState({
    sma: false, // Simple Moving Average (14)
    ema: false, // Exponential Moving Average (50)
  });

  // 1. MEMBUAT BASE DATA
  const rawData = useMemo(() => {
    return history.prices.map((item) => ({
      date: item[0],
      price: item[1],
    }));
  }, [history]);

  // 2. ALGORITMA HITUNG INDIKATOR
  const chartData = useMemo(() => {
    const smaPeriod = 14;
    const emaPeriod = 50;
    const k = 2 / (emaPeriod + 1);

    let previousEma = 0;

    return rawData.map((item, index, array) => {
      let sma = null;
      let ema = null;

      // Hitung SMA
      if (index >= smaPeriod - 1) {
        const slice = array.slice(index - smaPeriod + 1, index + 1);
        const sum = slice.reduce((acc, curr) => acc + curr.price, 0);
        sma = sum / smaPeriod;
      }

      // Hitung EMA
      if (index === 0) {
        previousEma = item.price;
        ema = item.price;
      } else {
        ema = item.price * k + previousEma * (1 - k);
        previousEma = ema;
      }

      if (index < emaPeriod) ema = null;

      return { ...item, sma, ema };
    });
  }, [rawData]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* HEADER CONTROL */}
      <div className="flex flex-wrap justify-between items-center mb-4 px-2 gap-2">
        <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
          <span>/// TECHNICAL_ANALYSIS</span>
        </div>

        {/* Buttons Group */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              setIndicators((prev) => ({ ...prev, sma: !prev.sma }))
            }
            className={`text-[10px] md:text-xs font-mono px-3 py-1 rounded border transition-all ${
              indicators.sma
                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500 font-bold"
                : "bg-background text-muted-foreground border-border hover:border-foreground"
            }`}
          >
            SMA (14)
          </button>

          <button
            onClick={() =>
              setIndicators((prev) => ({ ...prev, ema: !prev.ema }))
            }
            className={`text-[10px] md:text-xs font-mono px-3 py-1 rounded border transition-all ${
              indicators.ema
                ? "bg-purple-500/10 text-purple-500 border-purple-500 font-bold"
                : "bg-background text-muted-foreground border-border hover:border-foreground"
            }`}
          >
            EMA (50)
          </button>
        </div>
      </div>

      {/* CHART AREA */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
              opacity={0.4}
            />

            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), "dd MMM")}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "gray" }}
              minTickGap={30}
            />

            <YAxis
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "gray" }}
              tickFormatter={(number) => `$${number.toLocaleString()}`}
              width={60}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelFormatter={(date) =>
                format(new Date(date), "dd MMM yyyy, HH:mm")
              }
              // FIX: Gunakan 'any' agar TypeScript tidak error
              formatter={(value: any, name: any) => {
                const label =
                  name === "price" ? "Price" : String(name).toUpperCase();
                return [
                  `$${Number(value).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  label,
                ];
              }}
            />

            {/* --- FIX: PINDAH LEGEND KE KANAN --- */}
            <Legend
              verticalAlign="top"
              align="right" // <--- Ganti align jadi 'right'
              height={36}
              iconType="circle"
            />

            {/* GRAFIK UTAMA */}
            <Area
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
              name="Price"
              activeDot={{ r: 5 }}
            />

            {/* INDIKATOR SMA & EMA */}
            {indicators.sma && (
              <Line
                type="monotone"
                dataKey="sma"
                stroke="#eab308"
                strokeWidth={2}
                dot={false}
                name="SMA (14)"
                isAnimationActive={true}
                animationDuration={500}
              />
            )}

            {indicators.ema && (
              <Line
                type="monotone"
                dataKey="ema"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
                name="EMA (50)"
                isAnimationActive={true}
                animationDuration={500}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
