import { CoinData } from "@/types/coin";

// --- Ambil 100 Koin Teratas (FIX: Ubah dari 20 ke 100) ---
export async function getTopCoins(): Promise<CoinData[]> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h",
      { next: { revalidate: 60 } }, // Cache 60 detik agar hemat API limit
    );

    if (!res.ok) {
      throw new Error("Gagal mengambil data");
    }

    return res.json();
  } catch (error) {
    console.error("API Error (Top Coins):", error);
    return [];
  }
}

// --- Ambil Detail 1 Koin ---
export async function getCoinDetail(id: string) {
  try {
    const res = await fetch(
      // Pastikan market_data=true agar halaman detail tidak error
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`,
      { next: { revalidate: 60 } },
    );

    // DEBUG: Cek apakah kena limit CoinGecko
    if (res.status === 429) {
      console.log(
        `⚠️ KENA LIMIT! Gagal ambil data untuk: ${id}. Tunggu sebentar.`,
      );
      return null;
    }

    if (!res.ok) throw new Error("Gagal fetch detail koin");

    return res.json();
  } catch (error) {
    console.error("Error fetching detail:", error);
    return null;
  }
}

export interface ChartData {
  prices: [number, number][]; // Array [timestamp, price]
}

// --- Ambil History Chart ---
export async function getCoinHistory(id: string): Promise<ChartData | null> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`,
      { next: { revalidate: 60 } },
    );

    if (res.status === 429) return null; // Kena limit
    if (!res.ok) throw new Error("Gagal fetch history");

    return res.json();
  } catch (error) {
    console.error("API Error (History):", error);
    return null;
  }
}
