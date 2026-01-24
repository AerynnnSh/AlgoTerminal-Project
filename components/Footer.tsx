"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Footer() {
  // Opsional: Untuk memastikan tidak ada flicker saat render tema
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <footer className="border-t border-border bg-background mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-muted-foreground">
        {/* Kiri: Copyright */}
        <div className="opacity-70 hover:opacity-100 transition-opacity">
          &copy; {new Date().getFullYear()} AlgoTerminal. All systems
          operational.
        </div>

        {/* Kanan: Status Indikator */}
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            /// STATUS: ONLINE
          </span>
          <span className="hidden md:inline-block opacity-50">
            /// LATENCY: 12ms
          </span>
        </div>
      </div>
    </footer>
  );
}
