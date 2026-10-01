import Link from "next/link";
import { NS_DEER_SEASONS_2026, getCurrentSeasonStatus } from "@/lib/seasons";

export default function HomePage() {
  const status = getCurrentSeasonStatus();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950">
        <div className="absolute inset-0 bg-[url('/forest-pattern.svg')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Built for Northern Nova Scotia hunters & their friends
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-50 mb-6">
            NS Deer Paradise
          </h1>
          <p className="text-xl md:text-2xl text-stone-300 max-w-2xl mx-auto mb-4">
            Every deer hunter's dream website that does everything.
          </p>
          <p className="text-stone-400 max-w-xl mx-auto mb-10">
            Free account → confirmation email → logged into paradise.  
            Seasons, maps, journals, trail cams, weather, community — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-lg transition shadow-lg shadow-amber-900/40"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border border-stone-600 hover:border-stone-400 text-stone-200 font-medium transition"
            >
              Log In
            </Link>
          </div>

          {/* Live season status */}
          <div className="mt-14 inline-block px-6 py-4 rounded-xl bg-stone-900/70 border border-stone-700 backdrop-blur">
            <p className="text-sm text-stone-400 mb-1">2026 Season Status</p>
            <p className={`text-lg font-medium ${status.isOpen ? "text-emerald-400" : "text-stone-300"}`}>
              {status.message}
            </p>
          </div>
        </div>
      </header>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-stone-100">
          Everything a northern NS deer hunter needs
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Season Hub",
              desc: "Live dates for archery, youth & general seasons. Zones, bag limits, antlerless draws, Sunday rules.",
              icon: "📅",
            },
            {
              title: "Hunt Journal",
              desc: "Log every sit: weather, wind, moon, sightings, harvests. Searchable history and personal stats.",
              icon: "📓",
            },
            {
              title: "Trail Cam Gallery",
              desc: "Upload, tag, and organize your camera pics. Share with trusted buddies or keep private.",
              icon: "📷",
            },
            {
              title: "Maps & Waypoints",
              desc: "Crown land focus, stand locations, cam pins, wind tools — built for Nova Scotia woods.",
              icon: "🗺️",
            },
            {
              title: "Weather + Solunar",
              desc: "Hyper-local forecasts, barometric pressure, and a simple deer activity score for Maritime conditions.",
              icon: "☁️",
            },
            {
              title: "Your Hunting Crew",
              desc: "Private groups for friends, tips, gear swaps, and mentorship for the next generation of hunters.",
              icon: "🤝",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-emerald-800/60 transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-xl font-semibold text-stone-100 mb-2">{f.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick season table */}
      <section className="bg-stone-900/40 border-y border-stone-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">2026–2027 Deer Seasons (NS)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-700 text-stone-400">
                  <th className="py-3 pr-4">Season</th>
                  <th className="py-3 pr-4">Dates</th>
                  <th className="py-3 pr-4">Bag</th>
                  <th className="py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {NS_DEER_SEASONS_2026.map((s) => (
                  <tr key={s.type} className="border-b border-stone-800">
                    <td className="py-4 pr-4 font-medium text-stone-200">{s.label}</td>
                    <td className="py-4 pr-4 text-stone-300">
                      {s.start} → {s.end}
                    </td>
                    <td className="py-4 pr-4 text-stone-300">{s.bagLimit}</td>
                    <td className="py-4 text-stone-400 text-xs max-w-xs">{s.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-center text-xs text-stone-500">
            Always confirm with the official Nova Scotia DNR summary of regulations before heading out.
          </p>
        </div>
      </section>

      {/* CTA footer */}
      <footer className="mt-auto py-16 text-center">
        <p className="text-stone-400 mb-6">Ready to step into the woods prepared?</p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition"
        >
          Join Free — Enter Paradise
        </Link>
        <p className="mt-10 text-stone-600 text-sm">
          Built with ❤️ for the woods of northern Nova Scotia. Hunt safe. Hunt ethical.
        </p>
      </footer>
    </div>
  );
}
