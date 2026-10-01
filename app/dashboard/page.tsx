import Link from "next/link";
import { getCurrentSeasonStatus, NS_DEER_SEASONS_2026 } from "@/lib/seasons";

export default function DashboardPage() {
  const status = getCurrentSeasonStatus();

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Simple top nav */}
      <nav className="border-b border-stone-800 bg-stone-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-amber-500">
            🦌 NS Deer Paradise
          </Link>
          <div className="flex items-center gap-6 text-sm text-stone-300">
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="#" className="hover:text-white">Journal</Link>
            <Link href="/cams" className="text-amber-400 font-medium">Trail Cams</Link>
            <Link href="#" className="hover:text-white">Maps</Link>
            <Link href="#" className="hover:text-white">Crew</Link>
            <span className="text-stone-500">|</span>
            <button className="text-stone-400 hover:text-white">Sign out</button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-stone-50 mb-2">Welcome to Paradise</h1>
          <p className="text-stone-400">
            Your personal command center for northern Nova Scotia deer hunting.
          </p>
        </div>

        {/* Status cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800">
            <p className="text-sm text-stone-400 mb-1">Season Status</p>
            <p className={`text-xl font-semibold ${status.isOpen ? "text-emerald-400" : "text-stone-300"}`}>
              {status.isOpen ? "OPEN" : "CLOSED"}
            </p>
            <p className="text-sm text-stone-500 mt-1">{status.message}</p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800">
            <p className="text-sm text-stone-400 mb-1">Hunt Logs</p>
            <p className="text-xl font-semibold text-stone-200">0</p>
            <p className="text-sm text-stone-500 mt-1">Start logging sits</p>
          </div>

          <Link
            href="/cams"
            className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 to-stone-900 border border-amber-800/40 hover:border-amber-600/60 transition group"
          >
            <p className="text-sm text-amber-400/80 mb-1">Trail Cam Reader</p>
            <p className="text-xl font-semibold text-stone-100 group-hover:text-amber-300 transition">
              Mass Dump → Accurate Read
            </p>
            <p className="text-sm text-stone-500 mt-1">
              Dump the SD card. Filter empties. See the deer.
            </p>
          </Link>
        </div>

        {/* Quick season reminder */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-stone-200 mb-4">2026 Season Windows</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {NS_DEER_SEASONS_2026.map((s) => (
              <div
                key={s.type}
                className="p-4 rounded-xl bg-stone-900/80 border border-stone-800"
              >
                <p className="font-medium text-stone-100">{s.label}</p>
                <p className="text-sm text-stone-400 mt-1">
                  {s.start} → {s.end}
                </p>
                <p className="text-xs text-stone-500 mt-2 line-clamp-2">{s.notes}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section>
          <h2 className="text-lg font-semibold text-stone-200 mb-4">Your tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/cams"
              className="p-4 rounded-xl border border-amber-800/50 bg-amber-950/20 text-amber-200 text-sm text-center hover:border-amber-600 transition"
            >
              Mass Dump Trail Cam Reader ✓
            </Link>
            {["Hunt Journal", "Interactive Maps", "Weather + Solunar", "Private Crew Groups", "Gear Checklists", "Venison Recipes", "Trophy Room"].map(
              (item) => (
                <div
                  key={item}
                  className="p-4 rounded-xl border border-dashed border-stone-700 text-stone-500 text-sm text-center"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
