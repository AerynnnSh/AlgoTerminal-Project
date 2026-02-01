"use client";

import Link from "next/link";
import { Terminal, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import AuthButton from "./AuthButton"; // <-- Import Komponen AuthButton

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mencegah error hydration (perbedaan server/client)
  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* --- Logo Area --- */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-colors">
            <Terminal size={16} className="text-primary" />
            {/* Dot Glow Effect */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--primary)]"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold font-mono text-sm tracking-widest uppercase text-foreground">
              AlgoTerminal
            </span>
            <span className="text-[10px] text-muted-foreground font-mono tracking-widest">
              v2.5-STABLE
            </span>
          </div>
        </Link>

        {/* --- Kanan: Auth & Toggle Tema --- */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* 1. Tombol Login / Profil User */}
          <AuthButton />

          {/* Pemisah Kecil (Divider) */}
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

          {/* 2. Tombol Toggle Tema */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent hover:border-border transition-all text-zinc-500 hover:text-foreground"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
