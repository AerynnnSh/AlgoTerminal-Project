import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchlistState {
  savedIds: string[];
  toggleCoin: (id: string) => void;
  hasCoin: (id: string) => boolean;
  setSavedIds: (ids: string[]) => void; // <--- FUNGSI BARU
}

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      savedIds: [],

      toggleCoin: (id) => {
        const { savedIds } = get();
        if (savedIds.includes(id)) {
          set({ savedIds: savedIds.filter((savedId) => savedId !== id) });
        } else {
          set({ savedIds: [...savedIds, id] });
        }
      },

      hasCoin: (id) => get().savedIds.includes(id),

      // Fungsi untuk menimpa data lokal dengan data dari Database
      setSavedIds: (ids) => set({ savedIds: ids }),
    }),
    {
      name: "algoterminal-watchlist",
    },
  ),
);
