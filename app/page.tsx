// src/app/page.tsx
import { getTopCoins } from "@/lib/api";
import LiveTable from "@/components/LiveTable"; // Import komponen baru

export default async function Home() {
  // 1. Ambil data awal di Server (biar loading pertama ngebut)
  const initialData = await getTopCoins();

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
            <h1 className="text-4xl font-bold font-mono tracking-tighter text-white">
              AlgoTerminal<span className="text-emerald-500">.</span>
            </h1>
          </div>
          <p className="text-slate-400 font-mono text-sm pl-6 border-l-2 border-emerald-500/50">
            /// LIVE MARKET INTELLIGENCE SYSTEM
          </p>
        </header>

        {/* Panggil Tabel Live di sini */}
        <LiveTable initialData={initialData} />
      </div>
    </main>
  );
}
