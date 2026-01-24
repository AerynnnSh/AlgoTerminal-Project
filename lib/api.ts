// src/lib/api.ts
import { CoinData } from "@/types/coin";

export async function getTopCoins(): Promise<CoinData[]> {
  try {
    // Ambil 20 koin teratas, mata uang USD
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h",
      { next: { revalidate: 60 } }, // Update data tiap 60 detik
    );

    if (!res.ok) {
      throw new Error("Gagal mengambil data");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return []; // Jika error, kembalikan array kosong biar web ga crash
  }
}
