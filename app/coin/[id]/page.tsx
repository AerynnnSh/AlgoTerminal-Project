// src/app/coin/[id]/page.tsx

import { getCoinDetail, getCoinHistory } from "@/lib/api"; // Tambah getCoinHistory
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CoinChart from "@/components/CoinChart"; // Import komponen Chart

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CoinPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch Data secara Parallel (Biar ngebut)
  const coinData = getCoinDetail(id);
  const historyData = getCoinHistory(id);

  // Tunggu keduanya selesai
  const [coin, history] = await Promise.all([coinData, historyData]);

  // --- TAMPILAN ERROR ---
  if (!coin) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-12 flex flex-col items-center justify-center text-center font-sans">
        <div className="text-6xl mb-4 animate-pulse">⏳</div>
        <h1 className="text-2xl font-bold font-mono text-rose-500 mb-2">
          Data Tidak Ditemukan / API Limit
        </h1>
        <p className="text-slate-400 max-w-md">
          Silakan tunggu <strong>1 menit</strong> lalu refresh halaman ini.
        </p>
        <Link
          href="/"
          className="mt-8 px-6 py-2 bg-slate-800 rounded hover:bg-slate-700 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto">
        {/* Tombol Kembali */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Dashboard
        </Link>

        {/* Header Detail */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6">
          <img
            src={coin.image.large}
            alt={coin.name}
            className="w-16 h-16 md:w-20 md:h-20"
          />
          <div>
            <h1 className="text-4xl font-bold font-mono text-white tracking-tighter">
              {coin.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded text-sm font-mono uppercase tracking-wide">
                {coin.symbol}
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded text-sm font-mono border border-emerald-500/20">
                Rank #{coin.market_cap_rank}
              </span>
            </div>
          </div>

          <div className="md:ml-auto text-left md:text-right">
            <div className="text-sm text-slate-400 font-mono mb-1">
              Current Price
            </div>
            <div className="text-3xl md:text-5xl font-bold font-mono tracking-tighter text-white">
              ${coin.market_data.current_price.usd.toLocaleString()}
            </div>
            <div
              className={`text-lg font-bold mt-1 ${coin.market_data.price_change_percentage_24h >= 0 ? "text-emerald-400" : "text-rose-500"}`}
            >
              {coin.market_data.price_change_percentage_24h.toFixed(2)}% (24h)
            </div>
          </div>
        </div>

        {/* --- AREA GRAFIK BESAR (NEW) --- */}
        <div className="mb-10">
          {history ? (
            <CoinChart history={history} />
          ) : (
            <div className="h-[300px] w-full border border-slate-800 rounded-xl bg-slate-900/30 flex items-center justify-center text-slate-500 font-mono">
              Grafik tidak tersedia (API Limit)
            </div>
          )}
        </div>

        {/* Grid Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-colors">
            <div className="text-slate-500 text-xs uppercase font-mono mb-2">
              Market Cap
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              ${coin.market_data.market_cap.usd.toLocaleString()}
            </div>
          </div>
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-colors">
            <div className="text-slate-500 text-xs uppercase font-mono mb-2">
              Total Volume (24h)
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              ${coin.market_data.total_volume.usd.toLocaleString()}
            </div>
          </div>
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-colors">
            <div className="text-slate-500 text-xs uppercase font-mono mb-2">
              Circulating Supply
            </div>
            <div className="text-xl font-bold text-emerald-400 tracking-tight">
              {coin.market_data.circulating_supply.toLocaleString()}{" "}
              {coin.symbol.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="p-6 md:p-8 rounded-xl border border-slate-800 bg-slate-900/30">
          <h3 className="text-white font-mono text-xl mb-6 border-l-4 border-emerald-500 pl-4">
            /// ASSET DESCRIPTION
          </h3>
          <div
            className="prose prose-invert prose-slate max-w-none text-slate-400 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: coin.description.en || "No description available.",
            }}
          />
        </div>
      </div>
    </main>
  );
}
