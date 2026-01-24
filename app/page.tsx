import { getTopCoins } from "@/lib/api";
import LiveTable from "@/components/LiveTable";

export default async function Home() {
  const initialData = await getTopCoins();

  return (
    // pt-24: Padding atas supaya tabel tidak tertutup Navbar
    // Tidak ada Header, Tidak ada Judul Besar. Langsung Tabel.
    <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 font-sans max-w-7xl mx-auto flex flex-col">
      <div className="w-full relative z-10">
        <LiveTable initialData={initialData} />
      </div>
    </main>
  );
}
