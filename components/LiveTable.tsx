// src/components/LiveTable.tsx
"use client"; // Wajib untuk fitur interaktif/realtime

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter untuk navigasi
import { CoinData } from "@/types/coin";
import Sparkline from "./Sparkline"; // Import komponen grafik

interface LiveTableProps {
  initialData: CoinData[]; // Data awal dari server biar loading cepat
}

export default function LiveTable({ initialData }: LiveTableProps) {
  const [coins, setCoins] = useState<CoinData[]>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter(); // Inisialisasi router

  useEffect(() => {
    // Fungsi untuk ambil data terbaru
    const fetchData = async () => {
      setIsUpdating(true); // Efek visual loading kecil
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h",
        );
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error("Gagal update data:", error);
      } finally {
        setTimeout(() => setIsUpdating(false), 500);
      }
    };

    // Set Interval: Jalan setiap 15 detik
    const interval = setInterval(fetchData, 15000);

    return () => clearInterval(interval); // Bersihkan timer saat pindah halaman
  }, []);

  return (
    <div className="relative border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50">
      {/* Indikator Live Update (Pojok Kanan Atas Tabel) */}
      <div className="absolute top-0 right-0 p-2 z-10">
        <span
          className={`inline-flex items-center gap-2 text-[10px] font-mono uppercase px-2 py-1 rounded-full border ${
            isUpdating
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-slate-800 text-slate-500 border-slate-700"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isUpdating ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
            }`}
          ></span>
          {isUpdating ? "Updating..." : "Live Sync 15s"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm mt-6 md:mt-0">
          <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-xs border-b border-slate-800">
            <tr>
              <th className="p-4 min-w-[200px]">Asset</th>
              {/* Kolom Header untuk Grafik */}
              <th className="p-4 hidden md:table-cell">7d Trend</th>
              <th className="p-4 text-right">Price (USD)</th>
              <th className="p-4 text-right">24h Change</th>
              <th className="p-4 text-right hidden md:table-cell">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {coins.map((coin) => (
              <tr
                key={coin.id}
                onClick={() => router.push(`/coin/${coin.id}`)} // Aksi Navigasi
                className="hover:bg-slate-800/50 transition-colors group cursor-pointer" // cursor-pointer agar terlihat bisa diklik
              >
                {/* 1. Asset Name */}
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full grayscale group-hover:grayscale-0 transition-all"
                  />
                  <div>
                    <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {coin.name}
                    </div>
                    <div className="text-slate-500 text-xs uppercase">
                      {coin.symbol}
                    </div>
                  </div>
                </td>

                {/* 2. Sparkline Chart (Hidden on Mobile) */}
                <td className="p-4 hidden md:table-cell w-[150px]">
                  <Sparkline
                    data={coin.sparkline_in_7d?.price || []}
                    isPositive={coin.price_change_percentage_24h >= 0}
                  />
                </td>

                {/* 3. Price */}
                <td className="p-4 text-right font-mono text-white tracking-tight">
                  ${coin.current_price.toLocaleString()}
                </td>

                {/* 4. Change 24h */}
                <td
                  className={`p-4 text-right font-mono font-bold ${
                    coin.price_change_percentage_24h >= 0
                      ? "text-emerald-400"
                      : "text-rose-500"
                  }`}
                >
                  {coin.price_change_percentage_24h > 0 ? "+" : ""}
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>

                {/* 5. Volume */}
                <td className="p-4 text-right text-slate-500 font-mono text-xs hidden md:table-cell">
                  ${(coin.total_volume / 1000000).toFixed(0)}M
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
