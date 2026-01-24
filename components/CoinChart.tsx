"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ScriptableContext,
} from "chart.js";
import { ChartData } from "@/lib/api";
import { useTheme } from "next-themes"; // Import hook tema

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

interface CoinChartProps {
  history: ChartData;
}

export default function CoinChart({ history }: CoinChartProps) {
  const { theme } = useTheme(); // Deteksi tema aktif (light/dark)

  // Tentukan variabel warna berdasarkan tema
  const isDark = theme === "dark";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"; // Garis grid
  const textColor = isDark ? "#a1a1aa" : "#52525b"; // Warna teks (Zinc-400 vs Zinc-600)

  // Format Data untuk Chart.js
  const coinPrice = history.prices.map((price) => ({
    x: new Date(price[0]).toLocaleDateString(),
    y: price[1],
  }));

  const data = {
    labels: coinPrice.map((data) => data.x),
    datasets: [
      {
        fill: true,
        label: "Price (USD)",
        data: coinPrice.map((data) => data.y),
        borderColor: "#10b981", // Emerald-500 (Tetap Hijau)
        borderWidth: 2,
        pointRadius: 0, // Hilangkan titik-titik biar bersih
        pointHoverRadius: 4,
        // Gradient Fill
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)"); // Hijau transparan atas
          gradient.addColorStop(1, "rgba(16, 185, 129, 0)"); // Pudar di bawah
          return gradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Sembunyikan legend label
      },
      title: {
        display: true,
        text: "/// PRICE HISTORY (7 DAYS)",
        align: "start" as const,
        color: textColor, // Warna judul ikut tema
        font: {
          family: "monospace",
          size: 12,
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: isDark ? "#18181b" : "#ffffff", // Background tooltip
        titleColor: isDark ? "#ffffff" : "#000000",
        bodyColor: isDark ? "#a1a1aa" : "#52525b",
        borderColor: gridColor,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hilangkan grid vertikal biar bersih
        },
        ticks: {
          color: textColor, // Warna tanggal
          font: {
            size: 10,
          },
          maxTicksLimit: 7, // Batasi jumlah label tanggal
        },
      },
      y: {
        grid: {
          color: gridColor, // Grid horizontal adaptif
          borderDash: [5, 5], // Garis putus-putus
        },
        ticks: {
          color: textColor, // Warna harga
          font: {
            family: "monospace",
            size: 10,
          },
          callback: function (value: any) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  return (
    // Wrapper tanpa background color hardcoded, jadi transparan
    <div className="w-full h-full">
      <Line options={options} data={data} />
    </div>
  );
}
