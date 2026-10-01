import Link from "next/link";
import { NS_DEER_SEASONS_2026, getCurrentSeasonStatus } from "@/lib/seasons";

const FEATURES = [
  {
    title: "Land 360°",
    desc: "Stand in the woods on screen — 200 m around you, true north, real DEM + satellite.",
    tag: "New",
    href: "/land-3d",
  },
  {
    title: "Trail Cam AI",
    desc: "Mass-dump SD cards. On-device detection, empty filter, EXIF timelines. Photos stay yours.",
    tag: "Signature",
    href: "/cams",
  },
  {
    title: "Live Weather",
    desc: "Open-Meteo forecasts, wind, pressure, and a practical hunt score for NS.",
    tag: null,
    href: "/weather",
  },
  {
    title: "SOS / I Am Lost",
    desc: "GPS, back bearing home, alert contacts. Built for when the woods go sideways.",
    tag: "Safety",
    href: "/sos",
  },
  {
    title: "Master Baiter",
    desc: "Top attractants and recipes hunters actually use — with NS legal sense.",
    tag: null,
    href: "/master-baiter",
  },
  {
    title: "Crew Feed",
    desc: "Post the kill, react, stay tight with your hunting crew.",
    tag: null,
    href: "/feed",
  },
];

export default function HomePage() {
  const status = getCurrentSeasonStatus();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-deep">
      {/* HERO */}
      <header className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep/30 to-deep" />
        <div className="absolute top-[18%] left-[12%] w-[min(520px,90vw)] h-[min(520px,90vw)] rounded-full bg-moss-500/25 blur-[120px] animate-float-orb pointer-events-none" />
        <div
          className="absolute bottom-[20%] right-[8%] w-[min(400px,80vw)] h-[min(400px,80vw)] rounded-full bg-amber-400/12 blur-[100px] animate-float-orb pointer-events-none"
          style={{ animationDelay: "-8s" }}
        />
        {/* Subtle vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,7,8,0.85)_100%)]" />

        <nav className="absolute top-0 inset-x-0 z-20 pt-safe">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
            <span className="font-serif text-xl sm:text-2xl tracking-wide text-cream-50">
              BuckTracks
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="free-badge hidden sm:inline-flex">100% free</span>
              <Link href="/dashboard" className="btn-ghost text-sm py-2 px-4 sm:px-5">
                Enter
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4 sm:px-5">
                Join free
              </Link>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 pt-28 pb-24 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass text-amber-300/95 text-[11px] font-medium tracking-[0.14em] uppercase mb-8 animate-rise">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-soft" />
            Northern Nova Scotia · forever free
          </div>

          <h1
            className="font-serif text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] leading-[1.02] tracking-tight text-gradient-cream mb-7 animate-rise"
            style={{ animationDelay: "0.06s" }}
          >
            The woods,
            <br />
            <span className="text-gradient-amber">commanded.</span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl text-cream-300/70 max-w-2xl mx-auto mb-3 leading-relaxed animate-rise"
            style={{ animationDelay: "0.14s" }}
          >
            Land in 3D at your feet. Trail cams that sort themselves. Weather that matters.
            SOS when it counts. Built for hunters — not subscriptions.
          </p>
          <p
            className="text-sm text-moss-400/90 mb-12 animate-rise free-badge"
            style={{ animationDelay: "0.18s" }}
          >
            Every tool free · No paywall · No ads in the field
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-rise"
            style={{ animationDelay: "0.24s" }}
          >
            <Link href="/dashboard" className="btn-primary text-base px-10">
              Open the platform
            </Link>
            <Link href="/land-3d" className="btn-ghost text-base">
              See Land 200 m around you
            </Link>
          </div>

          <div
            className="mt-14 inline-flex flex-col items-center gap-1 px-8 py-4 rounded-2xl glass-strong animate-rise"
            style={{ animationDelay: "0.32s" }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-cream-300/35">
              2026 season pulse
            </span>
            <span
              className={`text-sm sm:text-base font-medium ${status.isOpen ? "text-moss-400" : "text-cream-200"}`}
            >
              {status.message}
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-deep to-transparent pointer-events-none" />
      </header>

      {/* FREE PROMISE */}
      <section className="relative border-y border-white/[0.04] bg-forest-950/40">
        <div className="max-w-5xl mx-auto px-5 py-12 grid sm:grid-cols-3 gap-8 text-center">
          {[
            ["$0", "Core tools"],
            ["Local AI", "Cams on your device"],
            ["No key hell", "Weather & DEM free"],
          ].map(([k, v]) => (
            <div key={v}>
              <p className="font-serif text-2xl text-amber-300/90 mb-1">{k}</p>
              <p className="text-xs uppercase tracking-widest text-cream-300/40">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative max-w-6xl mx-auto px-5 sm:px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.22em] text-amber-400/70 mb-3">
            Everything included
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream-50 tracking-tight">
            One platform. Full woods kit.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((f) => (
            <Link key={f.title} href={f.href} className="card-premium p-6 sm:p-7 group block">
              {f.tag && (
                <span className="inline-block text-[10px] uppercase tracking-widest text-amber-400/90 mb-3 px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10">
                  {f.tag}
                </span>
              )}
              <h3 className="text-lg sm:text-xl font-medium text-cream-50 mb-2 group-hover:text-amber-300 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-cream-300/50 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SEASONS */}
      <section id="seasons" className="relative border-y border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 to-deep pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 py-20">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-moss-400/80 mb-3">
              Nova Scotia
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream-50">2026–2027 deer seasons</h2>
          </div>

          <div className="glass-strong rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-cream-300/35 text-[10px] uppercase tracking-wider">
                  <th className="py-4 px-5 sm:px-6 font-medium">Season</th>
                  <th className="py-4 px-3 font-medium">Dates</th>
                  <th className="py-4 px-3 font-medium">Bag</th>
                  <th className="py-4 px-5 font-medium hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {NS_DEER_SEASONS_2026.map((s) => (
                  <tr
                    key={s.type}
                    className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.025] transition"
                  >
                    <td className="py-4 sm:py-5 px-5 sm:px-6 font-medium text-cream-100">{s.label}</td>
                    <td className="py-4 sm:py-5 px-3 text-cream-300/65 whitespace-nowrap text-xs sm:text-sm">
                      {s.start} → {s.end}
                    </td>
                    <td className="py-4 sm:py-5 px-3 text-cream-300/65 text-xs sm:text-sm">{s.bagLimit}</td>
                    <td className="py-4 sm:py-5 px-5 text-cream-300/35 text-xs max-w-xs hidden md:table-cell">
                      {s.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-center text-[11px] text-cream-300/25">
            Always confirm with official NS DNR before you hunt.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,100vw)] h-[280px] bg-amber-400/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-5 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream-50 mb-5 tracking-tight">
            Free. Beautiful. Ready for the stand.
          </h2>
          <p className="text-cream-300/55 mb-10 leading-relaxed text-sm sm:text-base">
            No premium tier for safety. No locked maps. No cam AI behind a paywall. BuckTracks is
            built for northern Nova Scotia hunters — and it stays free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn-primary text-base shadow-glow">
              Create free account
            </Link>
            <Link href="/dashboard" className="btn-ghost text-base">
              Skip to dashboard
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-12 text-center px-5">
        <p className="font-serif text-lg text-cream-100/80 mb-2">BuckTracks</p>
        <p className="text-cream-300/30 text-sm max-w-md mx-auto leading-relaxed">
          Built with care for the woods of northern Nova Scotia. Hunt safe. Hunt ethical. Everything
          free.
        </p>
        <p className="mt-6 text-[10px] text-cream-300/20">
          Land view inspired by{" "}
          <a
            href="https://glargod.github.io/terraview/"
            className="underline hover:text-cream-300/40"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terraview
          </a>
        </p>
      </footer>
    </div>
  );
}
