// src/app/coin/[id]/loading.tsx

export default function Loading() {
  return (
    // UBAH 1: Container utama gunakan 'bg-background' dan layout yang sama persis dengan page.tsx
    <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 font-sans max-w-7xl mx-auto animate-pulse bg-background">
      {/* Tombol Back Skeleton */}
      {/* UBAH 2: Gunakan 'bg-border' atau 'bg-card' untuk elemen skeleton agar mengikuti tema */}
      <div className="h-6 w-32 bg-border rounded mb-8"></div>

      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row gap-6 items-center mb-10 pb-10 border-b border-border">
        {/* Icon Circle */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-border rounded-full flex-shrink-0"></div>

        {/* Text Group */}
        <div className="flex-1 space-y-3 w-full">
          {/* Title */}
          <div className="h-10 w-48 bg-border rounded"></div>
          {/* Badges */}
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-border rounded"></div>
            <div className="h-6 w-20 bg-border rounded"></div>
          </div>
        </div>

        {/* Price Info (Right side) */}
        <div className="md:text-right space-y-2 w-full md:w-auto flex flex-col md:items-end">
          <div className="h-4 w-24 bg-border rounded"></div>
          <div className="h-10 w-40 bg-border rounded"></div>
        </div>
      </div>

      {/* Chart Skeleton (Kotak Besar) */}
      <div className="h-[400px] w-full bg-card border border-border rounded-xl mb-8"></div>

      {/* Grid Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-card border border-border rounded-xl p-6"
          >
            <div className="h-4 w-24 bg-border rounded mb-4"></div>
            <div className="h-8 w-32 bg-border rounded"></div>
          </div>
        ))}
      </div>

      {/* Description Skeleton */}
      <div className="h-48 w-full bg-card border border-border rounded-xl"></div>
    </main>
  );
}
