import Link from "next/link";
import { getCurrentSeasonStatus, NS_DEER_SEASONS_2026 } from "@/lib/seasons";
import { WeatherCard } from "@/components/WeatherCard";

export default function DashboardPage() {
  const status = getCurrentSeasonStatus();

  return (
    <div className="min-h-screen bg-deep">
      <nav className="sticky top-0 z-10 border-b border-white/[0.04] glass-strong">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
          <Link href="/dashboard" className="font-serif text-lg tracking-wide text-cream-100 shrink-0">
            BuckTracks
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 text-sm text-cream-300/60 overflow-x-auto">
            <Link href="/weather" className="hover:text-sky-300 shrink-0">
              Weather
            </Link>
            <Link href="/land-3d" className="hover:text-amber-300 shrink-0">
              Land 3D
            </Link>
            <Link href="/cams" className="hover:text-amber-300 shrink-0">
              Cams
            </Link>
            <Link href="/feed" className="hover:text-amber-300 shrink-0">
              Feed
            </Link>
            <Link href="/sos" className="text-red-400 shrink-0">
              SOS
            </Link>
            <Link href="/settings" className="hover:text-cream-100 shrink-0">
              Settings
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400/60 mb-2">Command center</p>
            <h1 className="font-serif text-3xl text-cream-50 tracking-tight">BuckTracks</h1>
            <p className="text-cream-300/50 text-sm">Northern Nova Scotia · live data · 3D land</p>
          </div>
          <Link
            href="/sos"
            className="inline-flex justify-center px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold shrink-0"
          >
            SOS / I Am Lost
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          <div className="card-premium p-6">
            <p className="text-xs uppercase tracking-wider text-cream-300/40 mb-2">Season</p>
            <p className={`text-2xl font-medium ${status.isOpen ? "text-moss-400" : "text-cream-200"}`}>
              {status.isOpen ? "OPEN" : "CLOSED"}
            </p>
            <p className="text-sm text-cream-300/40 mt-1">{status.message}</p>
          </div>
          <WeatherCard />
          <Link href="/land-3d" className="card-premium p-6 block border-amber-500/25">
            <p className="text-xs uppercase tracking-wider text-amber-400/70 mb-2">Land 360°</p>
            <p className="text-xl text-cream-50">3D terrain · north</p>
            <p className="text-sm text-cream-300/40 mt-1">Satellite + real elevation from your GPS</p>
          </Link>
        </div>

        <section className="mb-12">
          <h2 className="font-serif text-xl text-cream-100 mb-4">2026 seasons</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {NS_DEER_SEASONS_2026.map((s) => (
              <div key={s.type} className="card-premium p-4">
                <p className="font-medium text-cream-100 text-sm">{s.label}</p>
                <p className="text-xs text-cream-300/50 mt-1">
                  {s.start} → {s.end}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ["/land-3d", "Land 3D 360°"],
            ["/weather", "Live weather"],
            ["/cams", "Trail cam AI"],
            ["/master-baiter", "Master Baiter"],
            ["/feed", "Crew feed"],
            ["/settings", "Settings"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="p-4 rounded-xl border border-amber-500/25 bg-amber-400/5 text-amber-300 text-sm text-center"
            >
              {label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
