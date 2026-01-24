import { getCoinDetail, getCoinHistory } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CoinChart from "@/components/CoinChart";
import BackButton from "@/components/BackButton";
import ProfitCalculator from "@/components/ProfitCalculator"; // <--- 1. IMPORT COMPONENT BARU

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CoinPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch Data Parallel
  const coinData = getCoinDetail(id);
  const historyData = getCoinHistory(id);

  const [coin, history] = await Promise.all([coinData, historyData]);

  // --- TAMPILAN ERROR / LOADING ---
  if (!coin) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-4 animate-pulse">⏳</div>
        <h1 className="text-2xl font-bold font-mono text-primary mb-2">
          Syncing Data...
        </h1>
        <p className="text-muted-foreground max-w-md">
          Data sedang diambil atau API limit tercapai. Silakan tunggu sebentar
          lalu refresh.
        </p>
        <Link
          href="/"
          className="mt-8 px-6 py-2 bg-card border border-border rounded hover:bg-muted transition-colors flex items-center gap-2 text-foreground"
        >
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 font-sans max-w-7xl mx-auto">
      {/* Tombol Back */}
      <BackButton />

      {/* Header Info Koin */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8 pb-8 border-b border-border">
        {/* Icon Container */}
        <div className="p-4 bg-card rounded-2xl border border-border shadow-sm">
          <img
            src={coin.image.large}
            alt={coin.name}
            className="w-12 h-12 md:w-16 md:h-16"
          />
        </div>

        <div>
          {/* Nama Koin */}
          <h1 className="text-4xl md:text-5xl font-black font-sans text-foreground tracking-tight">
            {coin.name}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            {/* Symbol */}
            <span className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm font-mono uppercase tracking-wide border border-border">
              {coin.symbol}
            </span>
            {/* Rank */}
            <span className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-mono border border-primary/20">
              Rank #{coin.market_cap_rank}
            </span>
          </div>
        </div>

        <div className="md:ml-auto text-left md:text-right">
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-1">
            Current Price
          </div>
          {/* Harga */}
          <div className="text-3xl md:text-5xl font-bold font-mono tracking-tighter text-foreground">
            ${coin.market_data.current_price.usd.toLocaleString("en-US")}
          </div>
          {/* Persentase */}
          <div
            className={`text-lg font-bold mt-1 ${
              coin.market_data.price_change_percentage_24h >= 0
                ? "text-emerald-500"
                : "text-rose-500"
            }`}
          >
            {coin.market_data.price_change_percentage_24h.toFixed(2)}% (24h)
          </div>
        </div>
      </div>

      {/* --- CHART AREA --- */}
      <div className="mb-8 w-full h-[400px] p-4 rounded-xl border border-border bg-card shadow-sm">
        {history ? (
          <CoinChart history={history} />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground font-mono">
            Chart Data Unavailable (API Limit)
          </div>
        )}
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors shadow-sm">
          <div className="text-muted-foreground text-xs uppercase font-mono mb-2 tracking-widest">
            Market Cap
          </div>
          <div className="text-2xl font-bold text-foreground tracking-tight font-mono">
            ${coin.market_data.market_cap.usd.toLocaleString("en-US")}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors shadow-sm">
          <div className="text-muted-foreground text-xs uppercase font-mono mb-2 tracking-widest">
            Total Volume (24h)
          </div>
          <div className="text-2xl font-bold text-foreground tracking-tight font-mono">
            ${coin.market_data.total_volume.usd.toLocaleString("en-US")}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors shadow-sm">
          <div className="text-muted-foreground text-xs uppercase font-mono mb-2 tracking-widest">
            Circulating Supply
          </div>
          <div className="text-2xl font-bold text-primary tracking-tight font-mono">
            {coin.market_data.circulating_supply.toLocaleString("en-US")}{" "}
            <span className="text-sm text-muted-foreground">
              {coin.symbol.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* --- 2. GRID LAYOUT BARU: DESKRIPSI + KALKULATOR --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Kolom Kiri: Deskripsi (Lebar 2/3) */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-xl border border-border bg-card shadow-sm h-full">
          <h3 className="text-foreground font-mono text-xl mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]"></span>
            /// ASSET PROTOCOL
          </h3>
          <div
            className="prose prose-zinc dark:prose-invert max-w-none leading-relaxed font-sans text-sm md:text-base"
            dangerouslySetInnerHTML={{
              __html:
                coin.description.en ||
                "No description data available in database.",
            }}
          />
        </div>

        {/* Kolom Kanan: Kalkulator Profit (Lebar 1/3) */}
        <div className="lg:col-span-1 h-full">
          <ProfitCalculator
            currentPrice={coin.market_data.current_price.usd}
            symbol={coin.symbol}
          />
        </div>
      </div>
    </main>
  );
}
