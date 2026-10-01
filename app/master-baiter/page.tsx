import Link from "next/link";
import { MASTER_BAITS_TOP_10, CATEGORY_LABEL } from "@/lib/baits";

export default function MasterBaiterPage() {
  return (
    <div className="min-h-screen bg-deep text-cream-100">
      <nav className="sticky top-0 z-20 border-b border-white/[0.04] glass-strong">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg tracking-wide">
            BuckTracks
          </Link>
          <div className="flex gap-4 text-sm text-cream-300/60">
            <Link href="/feed" className="hover:text-cream-100">
              Feed
            </Link>
            <Link href="/sos" className="text-red-400/80">
              SOS
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-10 pb-24">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400/70 mb-2">
            Attractants · Recipes · Systems
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream-50 tracking-tight mb-3">
            Master Baiter
          </h1>
          <p className="text-cream-300/55 leading-relaxed max-w-xl">
            Top 10 buck draws used worldwide — minerals, scents, scrapes, and DIY recipes hunters
            actually run. Ranked by lasting results, not hype.
          </p>
        </div>

        {/* Legal banner */}
        <div className="mb-10 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100/90 leading-relaxed">
          <strong className="text-amber-300">Know the law before you pour anything.</strong> Food
          baits, mineral licks, and some scents are illegal or restricted in many places — including
          parts of Canada and some NS municipalities (e.g. local deer-feeding bylaws). This page is
          educational. Always check the current Nova Scotia hunting summary and local bylaws. When in
          doubt, use legal scent/scrape tactics only.
        </div>

        <ol className="space-y-5">
          {MASTER_BAITS_TOP_10.map((b) => (
            <li key={b.rank} className="card-premium p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-300 font-semibold">
                  {b.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-lg font-medium text-cream-50">{b.name}</h2>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-cream-300/50">
                      {CATEGORY_LABEL[b.category]}
                    </span>
                  </div>
                  <p className="text-xs text-cream-300/35 mb-3">{b.region}</p>
                  <p className="text-sm text-cream-200/80 leading-relaxed mb-2">{b.why}</p>
                  <p className="text-sm text-cream-300/55 leading-relaxed mb-2">
                    <span className="text-cream-300/80">How: </span>
                    {b.how}
                  </p>
                  <p className="text-xs text-moss-400/80 mb-3">Season: {b.season}</p>

                  {b.recipe && (
                    <div className="mt-3 rounded-xl bg-black/30 border border-white/5 p-4">
                      <p className="text-xs uppercase tracking-wider text-amber-400/70 mb-2">
                        Recipe
                      </p>
                      <ul className="space-y-1.5 text-sm text-cream-300/70">
                        {b.recipe.map((step) => (
                          <li key={step} className="flex gap-2">
                            <span className="text-amber-500/50">·</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="mt-3 text-xs text-red-300/50 leading-relaxed">{b.legalNote}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-12 text-center text-xs text-cream-300/25 max-w-md mx-auto leading-relaxed">
          Habitat and wind beat any bottle. Master Baiter is for legal, ethical setups — not shortcuts
          that break the rules.
        </p>
      </main>
    </div>
  );
}
