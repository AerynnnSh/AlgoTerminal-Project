import { CoinData } from "@/types/coin";

// --- Ambil 20 Koin Teratas ---
export async function getTopCoins(): Promise<CoinData[]> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h",
      { next: { revalidate: 60 } },
    );

    if (!res.ok) {
      throw new Error("Gagal mengambil data");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// --- Ambil Detail 1 Koin ---
export async function getCoinDetail(id: string) {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true`,
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
