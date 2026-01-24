// src/app/loading.tsx

export default function Loading() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 font-sans max-w-7xl mx-auto animate-pulse bg-background">
      {/* --- Header Dashboard Skeleton --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="h-8 w-48 bg-border rounded mb-2"></div>
          <div className="h-4 w-64 bg-border/60 rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-card border border-border rounded"></div>
          <div className="h-10 w-24 bg-card border border-border rounded"></div>
        </div>
      </div>

      {/* --- Market Stats / Ticker Skeleton --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 bg-card border border-border rounded-xl p-4"
          >
            <div className="h-4 w-20 bg-border rounded mb-3"></div>
            <div className="h-6 w-32 bg-border rounded"></div>
          </div>
        ))}
      </div>

      {/* --- Table / List Skeleton (Mimic Homepage) --- */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="h-12 bg-muted/50 border-b border-border w-full"></div>

        {/* Table Rows */}
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-4">
              {/* Rank */}
              <div className="h-4 w-4 bg-border rounded"></div>
              {/* Coin Icon & Name */}
              <div className="h-10 w-10 bg-border rounded-full shrink-0"></div>
              <div className="flex-1 h-6 bg-border rounded"></div>
              {/* Price/Chart */}
              <div className="hidden md:block h-8 w-24 bg-border rounded"></div>
              <div className="h-6 w-20 bg-border rounded ml-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
