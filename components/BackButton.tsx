// components/BackButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const [isFading, setIsFading] = useState(false);

  const handleBack = () => {
    // 1. Mulai Fade Out (Layar jadi Biru pelan-pelan)
    setIsFading(true);

    // 2. Tunggu 500ms (sesuai CSS), baru pindah halaman
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  return (
    <>
      {/* Overlay Fade */}
      <div className={`fade-overlay ${isFading ? "active" : ""}`} />

      {/* Tombol Back */}
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group cursor-pointer"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-mono text-sm uppercase tracking-widest">
          Back to Terminal
        </span>
      </button>
    </>
  );
}
