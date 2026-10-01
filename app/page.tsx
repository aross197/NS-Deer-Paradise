import Link from "next/link";
import { NS_DEER_SEASONS_2026, getCurrentSeasonStatus } from "@/lib/seasons";

export default function HomePage() {
  const status = getCurrentSeasonStatus();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* ===== HERO ===== */}
      <header className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden">
        {/* Atmospheric layers */}
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep/40 to-deep" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] rounded-full bg-moss-500/20 blur-[100px] animate-float-orb pointer-events-none" />
        <div
          className="absolute bottom-1/3 right-1/5 w-[320px] h-[320px] rounded-full bg-amber-400/10 blur-[90px] animate-float-orb pointer-events-none"
          style={{ animationDelay: "-7s" }}
        />

        {/* Top nav */}
        <nav className="absolute top-0 inset-x-0 z-20">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <span className="font-serif text-xl tracking-wide text-cream-100">
              NS Deer Paradise
            </span>
            <div className="flex items-center gap-3">
              <Link href="/login" className="btn-ghost text-sm py-2 px-5">
                Log in
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-5">
                Join free
              </Link>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass text-amber-300 text-xs font-medium tracking-wide uppercase mb-10 animate-rise">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-soft" />
            Northern Nova Scotia · Built for the woods
          </div>

          <h1
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight text-gradient-cream mb-8 animate-rise"
            style={{ animationDelay: "0.08s" }}
          >
            Every deer hunter's
            <br />
            <span className="text-gradient-amber">dream platform</span>
          </h1>

          <p
            className="text-lg md:text-xl text-cream-300/80 max-w-2xl mx-auto mb-4 leading-relaxed animate-rise"
            style={{ animationDelay: "0.16s" }}
          >
            Seasons. Maps. Journals. Accurate trail-cam mass dump reader.
            Weather. Community. One place that does everything.
          </p>
          <p
            className="text-sm text-cream-300/50 max-w-lg mx-auto mb-12 animate-rise"
            style={{ animationDelay: "0.22s" }}
          >
            Free account → confirmation email → logged into paradise.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-rise"
            style={{ animationDelay: "0.28s" }}
          >
            <Link href="/register" className="btn-primary text-base">
              Create free account
            </Link>
            <Link href="/cams" className="btn-ghost text-base">
              See the trail cam reader
            </Link>
          </div>

          {/* Live season pill */}
          <div
            className="mt-16 inline-flex flex-col items-center gap-1 px-7 py-4 rounded-2xl glass-strong animate-rise"
            style={{ animationDelay: "0.36s" }}
          >
            <span className="text-[11px] uppercase tracking-widest text-cream-300/40">
              2026 Season
            </span>
            <span
              className={`text-base font-medium ${status.isOpen ? "text-moss-400" : "text-cream-200"}`}
            >
              {status.message}
            </span>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-deep to-transparent pointer-events-none" />
      </header>

      {/* ===== FEATURES ===== */}
      <section className="relative max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400/70 mb-3">
            The complete system
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-cream-100 tracking-tight">
            Built for serious hunters
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "Mass Dump Cam Reader",
              desc: "Dump an entire SD card. Accurate EXIF, animal detection, empty-frame filter, deer & buck tags with confidence.",
              tag: "Signature",
              href: "/cams",
            },
            {
              title: "Season Hub",
              desc: "Live 2026–2027 dates, zones 101–112, antlerless draws, bag limits, youth & Sunday rules — always current.",
              tag: null,
              href: "#seasons",
            },
            {
              title: "Hunt Journal",
              desc: "Log every sit: weather, wind, moon, sightings, harvests. Searchable history and personal stats.",
              tag: null,
              href: "#",
            },
            {
              title: "Crown Land Maps",
              desc: "Official NS open data overlays, waypoints, stands, cam pins, wind tools for Maritime woods.",
              tag: null,
              href: "#",
            },
            {
              title: "Weather + Solunar",
              desc: "Hyper-local forecasts, pressure trends, solunar tables, and a practical activity score.",
              tag: null,
              href: "#",
            },
            {
              title: "Your Crew",
              desc: "Private groups for hunting buddies, tips, gear swaps, and mentoring the next generation.",
              tag: null,
              href: "#",
            },
          ].map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="card-premium p-7 group block"
            >
              {f.tag && (
                <span className="inline-block text-[10px] uppercase tracking-widest text-amber-400/90 mb-3 px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10">
                  {f.tag}
                </span>
              )}
              <h3 className="text-xl font-medium text-cream-50 mb-2 group-hover:text-amber-300 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-cream-300/55 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== SEASONS TABLE ===== */}
      <section id="seasons" className="relative border-y border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/50 to-deep pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-moss-400/80 mb-3">
              Nova Scotia
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream-100">
              2026–2027 Deer Seasons
            </h2>
          </div>

          <div className="glass-strong rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-cream-300/40 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-medium">Season</th>
                  <th className="py-4 px-4 font-medium">Dates</th>
                  <th className="py-4 px-4 font-medium">Bag</th>
                  <th className="py-4 px-6 font-medium hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {NS_DEER_SEASONS_2026.map((s) => (
                  <tr
                    key={s.type}
                    className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition"
                  >
                    <td className="py-5 px-6 font-medium text-cream-100">{s.label}</td>
                    <td className="py-5 px-4 text-cream-300/70 whitespace-nowrap">
                      {s.start} → {s.end}
                    </td>
                    <td className="py-5 px-4 text-cream-300/70">{s.bagLimit}</td>
                    <td className="py-5 px-6 text-cream-300/40 text-xs max-w-xs hidden md:table-cell">
                      {s.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-center text-xs text-cream-300/30">
            Always confirm with the official Nova Scotia DNR summary before hunting.
          </p>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-400/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-5xl text-cream-50 mb-6 tracking-tight">
            Step into the woods prepared
          </h2>
          <p className="text-cream-300/60 mb-10 leading-relaxed">
            Free forever for the core tools. No clutter. No gimmicks.
            Just the best hunting command center built for northern Nova Scotia.
          </p>
          <Link href="/register" className="btn-primary text-base shadow-glow">
            Join free — enter paradise
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-10 text-center">
        <p className="text-cream-300/30 text-sm">
          Built with care for the woods of northern Nova Scotia. Hunt safe. Hunt ethical.
        </p>
      </footer>
    </div>
  );
}
