"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
  data: number[];
  isPositive: boolean;
}

export default function Sparkline({ data, isPositive }: SparklineProps) {
  // Format data agar bisa dibaca Recharts
  const chartData = data.map((val, i) => ({ i, val }));
  const color = isPositive ? "#10b981" : "#f43f5e"; // Hijau atau Merah

  return (
    <div className="h-[40px] w-[100px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          {/* Sembunyikan Axis agar bersih */}
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Line
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
