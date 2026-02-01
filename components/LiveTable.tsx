"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CoinData } from "@/types/coin";
import Sparkline from "./Sparkline";
import {
  Star,
  ArrowUpDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RefreshCcw,
  Search,
} from "lucide-react";
import { useWatchlist } from "@/store/useWatchlist";

// --- IMPORT SUPABASE ---
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface LiveTableProps {
  initialData: CoinData[];
}

type SortKey =
  | "market_cap_rank"
  | "current_price"
  | "price_change_percentage_24h"
  | "total_volume"
  | "market_cap";

export default function LiveTable({ initialData }: LiveTableProps) {
  // State Data
  const [coins, setCoins] = useState<CoinData[]>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // State Sorting, Filtering & Search
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({ key: "market_cap_rank", direction: "asc" });

  const [showFavOnly, setShowFavOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const router = useRouter();

  // Ambil Store Zustand
  const { toggleCoin, savedIds, setSavedIds } = useWatchlist();

  // State User (Login)
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  // 1. Cek User & Sync Database saat pertama kali load
  useEffect(() => {
    const syncWatchlist = async () => {
      // Cek siapa yang login
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Jika login, ambil data dari tabel 'watchlist'
        const { data, error } = await supabase
          .from("watchlist")
          .select("coin_id");

        if (!error && data) {
          // Ambil cuma ID-nya aja, lalu update Store Lokal
          const dbIds = data.map((item) => item.coin_id);
          setSavedIds(dbIds);
        }
      }
    };

    syncWatchlist();
  }, []); // Run sekali pas mount

  // 2. Fetch Market Data (CoinGecko)
  useEffect(() => {
    const fetchData = async () => {
      setIsUpdating(true);
      setErrorMsg(null);

      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h",
        );

        if (res.status === 429) {
          if (coins.length === 0) setErrorMsg("API RATE LIMIT REACHED.");
          return;
        }

        if (!res.ok) throw new Error("Network Error");

        const data = await res.json();
        setCoins(data);
      } catch (error) {
        if (coins.length === 0) setErrorMsg("FAILED TO FETCH MARKET DATA.");
      } finally {
        setTimeout(() => setIsUpdating(false), 500);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  // 3. LOGIC KLIK BINTANG (HYBRID)
  const handleStarClick = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    // A. Cek apakah ini aksi "Add" atau "Remove" sebelum di-toggle
    const isAdding = !savedIds.includes(id);

    // B. Update UI duluan (Optimistic Update) biar user gak nunggu loading
    toggleCoin(id);

    // C. Kalau user LOGIN, update juga ke Database Supabase
    if (user) {
      if (isAdding) {
        // Simpan ke DB
        const { error } = await supabase
          .from("watchlist")
          .insert({ user_id: user.id, coin_id: id });

        if (error) console.error("Gagal simpan ke DB:", error);
      } else {
        // Hapus dari DB
        const { error } = await supabase
          .from("watchlist")
          .delete()
          .match({ user_id: user.id, coin_id: id });

        if (error) console.error("Gagal hapus dari DB:", error);
      }
    }
  };

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  // Logic Pengolahan Data
  const processedCoins = [...coins]
    .filter((coin) => {
      const matchesFav = showFavOnly ? savedIds.includes(coin.id) : true;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query);
      return matchesFav && matchesSearch;
    })
    .sort((a, b) => {
      // @ts-ignore
      const valA = a[sortConfig.key] ?? 0;
      // @ts-ignore
      const valB = b[sortConfig.key] ?? 0;
      if (sortConfig.key === "market_cap_rank") {
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    });

  const totalPages = Math.ceil(processedCoins.length / ITEMS_PER_PAGE);
  const paginatedCoins = processedCoins.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [showFavOnly, sortConfig, searchQuery]);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm transition-colors duration-300 flex flex-col">
      {/* HEADER CONTROL */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 border-b border-border gap-4 bg-muted/20">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              errorMsg
                ? "bg-rose-500"
                : isUpdating
                  ? "bg-primary animate-pulse"
                  : "bg-zinc-500"
            }`}
          ></div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            {errorMsg ? "SYSTEM ALERT" : `LIVE DATA (${processedCoins.length})`}
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors h-4 w-4" />
            <input
              type="text"
              placeholder="SEARCH (e.g. HYPE)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-xs font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all uppercase placeholder:normal-case"
            />
          </div>

          <button
            onClick={() => setShowFavOnly(!showFavOnly)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-mono border transition-all whitespace-nowrap ${
              showFavOnly
                ? "bg-primary/10 border-primary text-primary"
                : "bg-background border-border text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-600"
            }`}
          >
            <Filter size={14} />
            {showFavOnly ? "Show All" : "Show Favorites"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/30 text-muted-foreground font-medium text-xs uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-6 py-4 w-12 text-center">★</th>
              <th
                className="px-6 py-4 cursor-pointer hover:text-foreground group select-none"
                onClick={() => handleSort("market_cap_rank")}
              >
                <div className="flex items-center gap-1">
                  Asset{" "}
                  <ArrowUpDown
                    size={10}
                    className="opacity-30 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </th>
              <th className="px-6 py-4 hidden md:table-cell">7D Trend</th>
              <th
                className="px-6 py-4 text-right cursor-pointer hover:text-foreground group select-none"
                onClick={() => handleSort("current_price")}
              >
                <div className="flex items-center justify-end gap-1">
                  Price{" "}
                  <ArrowUpDown
                    size={10}
                    className="opacity-30 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </th>
              <th
                className="px-6 py-4 text-right cursor-pointer hover:text-foreground group select-none"
                onClick={() => handleSort("price_change_percentage_24h")}
              >
                <div className="flex items-center justify-end gap-1">
                  24h %{" "}
                  <ArrowUpDown
                    size={10}
                    className="opacity-30 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </th>
              <th
                className="px-6 py-4 text-right hidden lg:table-cell cursor-pointer hover:text-foreground group select-none"
                onClick={() => handleSort("total_volume")}
              >
                <div className="flex items-center justify-end gap-1">
                  Volume{" "}
                  <ArrowUpDown
                    size={10}
                    className="opacity-30 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </th>
              <th
                className="px-6 py-4 text-right hidden md:table-cell cursor-pointer hover:text-foreground group select-none"
                onClick={() => handleSort("market_cap")}
              >
                <div className="flex items-center justify-end gap-1">
                  Mkt Cap{" "}
                  <ArrowUpDown
                    size={10}
                    className="opacity-30 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {paginatedCoins.length > 0 ? (
              paginatedCoins.map((coin) => {
                const isSaved = savedIds.includes(coin.id);
                const priceChange = coin.price_change_percentage_24h || 0;

                return (
                  <tr
                    key={coin.id}
                    onClick={() => router.push(`/coin/${coin.id}`)}
                    className="group cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => handleStarClick(e, coin.id)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          size={16}
                          className={
                            isSaved
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-500"
                          }
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-6 text-right">
                          {coin.market_cap_rank}
                        </span>
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {coin.name}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase font-mono">
                            {coin.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell w-[140px]">
                      <Sparkline
                        data={coin.sparkline_in_7d?.price || []}
                        isPositive={priceChange >= 0}
                      />
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-foreground">
                      ${(coin.current_price || 0).toLocaleString("en-US")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          priceChange >= 0
                            ? "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20"
                            : "text-rose-500 bg-rose-500/10 dark:bg-rose-500/20"
                        }`}
                      >
                        {priceChange > 0 ? "+" : ""}
                        {priceChange.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground text-xs font-mono hidden lg:table-cell">
                      ${((coin.total_volume || 0) / 1000000000).toFixed(2)}B
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground text-xs font-mono hidden md:table-cell">
                      ${((coin.market_cap || 0) / 1000000000).toFixed(2)}B
                    </td>
                  </tr>
                );
              })
            ) : (
              // HANDLING EMPTY STATE
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-32 text-muted-foreground font-mono"
                >
                  {errorMsg ? (
                    <div className="flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in duration-300">
                      <div className="p-3 bg-rose-500/10 rounded-full border border-rose-500/20">
                        <AlertTriangle size={32} className="text-rose-500" />
                      </div>
                      <div className="text-rose-500 font-bold text-lg">
                        {errorMsg}
                      </div>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                        Server data provider sedang sibuk (Rate Limit). Data
                        akan otomatis dimuat ulang.
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs rounded border border-border flex items-center gap-2 transition-colors"
                      >
                        <RefreshCcw size={12} /> Force Reload
                      </button>
                    </div>
                  ) : searchQuery ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-muted/50 rounded-full">
                        <Search size={24} className="opacity-40" />
                      </div>
                      <div className="font-bold">
                        NO RESULTS FOR "{searchQuery}"
                      </div>
                      <div className="text-xs opacity-50">
                        Check spelling or try symbol (e.g. BTC)
                      </div>
                    </div>
                  ) : showFavOnly ? (
                    <div className="flex flex-col items-center gap-2">
                      <Star size={32} className="text-zinc-700" />
                      <span>Watchlist kosong.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="animate-pulse">
                        Fetching satellite data...
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINATION */}
      {processedCoins.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <div className="text-xs text-muted-foreground font-mono">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, processedCoins.length)} of{" "}
            {processedCoins.length} assets
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-background border border-transparent hover:border-border disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs font-mono font-bold px-4">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-background border border-transparent hover:border-border disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
