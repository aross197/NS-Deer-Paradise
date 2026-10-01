import Link from "next/link";
import { getCurrentSeasonStatus, NS_DEER_SEASONS_2026 } from "@/lib/seasons";

export default function DashboardPage() {
  const status = getCurrentSeasonStatus();

  return (
    <div className="min-h-screen bg-deep">
      <nav className="sticky top-0 z-10 border-b border-white/[0.04] glass-strong">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg tracking-wide text-cream-100">
            NS Deer Paradise
          </Link>
          <div className="flex items-center gap-6 text-sm text-cream-300/60">
            <Link href="/dashboard" className="text-cream-100 font-medium">Dashboard</Link>
            <Link href="#" className="hover:text-cream-100 transition">Journal</Link>
            <Link href="/cams" className="hover:text-amber-300 transition">Trail Cams</Link>
            <Link href="#" className="hover:text-cream-100 transition">Maps</Link>
            <Link href="#" className="hover:text-cream-100 transition">Crew</Link>
            <span className="text-white/10">|</span>
            <button className="text-cream-300/40 hover:text-cream-100 transition">Sign out</button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400/60 mb-2">Command center</p>
          <h1 className="font-serif text-3xl md:text-4xl text-cream-50 tracking-tight mb-2">
            Welcome to Paradise
          </h1>
          <p className="text-cream-300/50">
            Your personal hub for northern Nova Scotia deer hunting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          <div className="card-premium p-6">
            <p className="text-xs uppercase tracking-wider text-cream-300/40 mb-2">Season status</p>
            <p className={`text-2xl font-medium ${status.isOpen ? "text-moss-400" : "text-cream-200"}`}>
              {status.isOpen ? "OPEN" : "CLOSED"}
            </p>
            <p className="text-sm text-cream-300/40 mt-1">{status.message}</p>
          </div>

          <div className="card-premium p-6">
            <p className="text-xs uppercase tracking-wider text-cream-300/40 mb-2">Hunt logs</p>
            <p className="text-2xl font-medium text-cream-100">0</p>
            <p className="text-sm text-cream-300/40 mt-1">Start logging sits</p>
          </div>

          <Link
            href="/cams"
            className="card-premium p-6 block border-amber-500/20 hover:border-amber-400/40 group"
          >
            <p className="text-xs uppercase tracking-wider text-amber-400/70 mb-2">Trail cam reader</p>
            <p className="text-xl font-medium text-cream-50 group-hover:text-amber-300 transition">
              Mass Dump → Accurate Read
            </p>
            <p className="text-sm text-cream-300/40 mt-1">
              Dump the SD card. Filter empties. See the deer.
            </p>
          </Link>
        </div>

        <section className="mb-14">
          <h2 className="font-serif text-xl text-cream-100 mb-5">2026 Season windows</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {NS_DEER_SEASONS_2026.map((s) => (
              <div key={s.type} className="card-premium p-5">
                <p className="font-medium text-cream-100">{s.label}</p>
                <p className="text-sm text-cream-300/50 mt-1">
                  {s.start} → {s.end}
                </p>
                <p className="text-xs text-cream-300/30 mt-2 line-clamp-2">{s.notes}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-cream-300/40 mb-4">Your tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href="/cams"
              className="p-4 rounded-xl border border-amber-500/30 bg-amber-400/5 text-amber-300 text-sm text-center hover:border-amber-400/50 transition"
            >
              Mass Dump Trail Cam Reader ✓
            </Link>
            {[
              "Hunt Journal",
              "Interactive Maps",
              "Weather + Solunar",
              "Private Crew Groups",
              "Gear Checklists",
              "Venison Recipes",
              "Trophy Room",
            ].map((item) => (
              <div
                key={item}
                className="p-4 rounded-xl border border-dashed border-white/[0.06] text-cream-300/30 text-sm text-center"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
