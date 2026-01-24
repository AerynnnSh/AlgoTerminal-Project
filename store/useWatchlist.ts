// src/store/useWatchlist.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchlistState {
  savedIds: string[]; // Daftar ID koin yang disimpan
  toggleCoin: (id: string) => void; // Fungsi untuk Add/Remove
  hasCoin: (id: string) => boolean; // Cek apakah koin ada di daftar
}

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      savedIds: [], // Awalnya kosong

      toggleCoin: (id) => {
        const { savedIds } = get();
        // Jika sudah ada, hapus. Jika belum, tambahkan.
        if (savedIds.includes(id)) {
          set({ savedIds: savedIds.filter((savedId) => savedId !== id) });
        } else {
          set({ savedIds: [...savedIds, id] });
        }
      },

      hasCoin: (id) => get().savedIds.includes(id),
    }),
    {
      name: "algoterminal-watchlist", // Nama key di LocalStorage browser
    },
  ),
);
