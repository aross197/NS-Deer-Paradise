import Link from "next/link";
import { getCurrentSeasonStatus, NS_DEER_SEASONS_2026 } from "@/lib/seasons";

export default function DashboardPage() {
  const status = getCurrentSeasonStatus();

  return (
    <div className="min-h-screen bg-deep">
      <nav className="sticky top-0 z-10 border-b border-white/[0.04] glass-strong">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg tracking-wide text-cream-100">
            BuckTracks
          </Link>
          <div className="flex items-center gap-4 text-sm text-cream-300/60 overflow-x-auto">
            <Link href="/dashboard" className="text-cream-100 font-medium shrink-0">
              Dashboard
            </Link>
            <Link href="/feed" className="hover:text-amber-300 transition shrink-0">
              Feed
            </Link>
            <Link href="/master-baiter" className="hover:text-amber-300 transition shrink-0">
              Master Baiter
            </Link>
            <Link href="/cams" className="hover:text-amber-300 transition shrink-0">
              Cams
            </Link>
            <Link
              href="/sos"
              className="text-red-400/90 hover:text-red-300 font-medium transition shrink-0"
            >
              SOS
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400/60 mb-2">
              Command center
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-cream-50 tracking-tight mb-2">
              Welcome to Paradise
            </h1>
            <p className="text-cream-300/50">Northern Nova Scotia deer hunting hub.</p>
          </div>
          <Link
            href="/sos"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-sm font-semibold shadow-[0_0_24px_rgba(220,38,38,0.35)] transition shrink-0"
          >
            SOS / I Am Lost
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          <div className="card-premium p-6">
            <p className="text-xs uppercase tracking-wider text-cream-300/40 mb-2">Season status</p>
            <p
              className={`text-2xl font-medium ${
                status.isOpen ? "text-moss-400" : "text-cream-200"
              }`}
            >
              {status.isOpen ? "OPEN" : "CLOSED"}
            </p>
            <p className="text-sm text-cream-300/40 mt-1">{status.message}</p>
          </div>

          <Link
            href="/master-baiter"
            className="card-premium p-6 block border-amber-500/20 hover:border-amber-400/40 group"
          >
            <p className="text-xs uppercase tracking-wider text-amber-400/70 mb-2">Master Baiter</p>
            <p className="text-xl font-medium text-cream-50 group-hover:text-amber-300 transition">
              Top 10 baits & recipes
            </p>
            <p className="text-sm text-cream-300/40 mt-1">Worldwide draws to bring in the buck.</p>
          </Link>

          <Link
            href="/feed"
            className="card-premium p-6 block border-amber-500/20 hover:border-amber-400/40 group"
          >
            <p className="text-xs uppercase tracking-wider text-amber-400/70 mb-2">Crew feed</p>
            <p className="text-xl font-medium text-cream-50 group-hover:text-amber-300 transition">
              Post your kill · React
            </p>
            <p className="text-sm text-cream-300/40 mt-1">Harvests, tips, respect.</p>
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
              href="/master-baiter"
              className="p-4 rounded-xl border border-amber-500/30 bg-amber-400/5 text-amber-300 text-sm text-center hover:border-amber-400/50 transition"
            >
              Master Baiter ✓
            </Link>
            <Link
              href="/feed"
              className="p-4 rounded-xl border border-amber-500/30 bg-amber-400/5 text-amber-300 text-sm text-center hover:border-amber-400/50 transition"
            >
              Crew Feed ✓
            </Link>
            <Link
              href="/cams"
              className="p-4 rounded-xl border border-amber-500/30 bg-amber-400/5 text-amber-300 text-sm text-center hover:border-amber-400/50 transition"
            >
              Trail Cams ✓
            </Link>
            <Link
              href="/sos"
              className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-300 text-sm text-center hover:border-red-400/50 transition"
            >
              SOS ✓
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
