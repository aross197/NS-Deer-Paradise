import Link from "next/link";

export default function TrailCamsPage() {
  return (
    <div className="min-h-screen bg-deep text-cream-100">
      <nav className="sticky top-0 z-20 border-b border-white/[0.04] glass-strong">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg tracking-wide text-cream-100">
            NS Deer Paradise
          </Link>
          <div className="flex items-center gap-6 text-sm text-cream-300/60">
            <Link href="/dashboard" className="hover:text-cream-100 transition">Dashboard</Link>
            <Link href="/cams" className="text-amber-400 font-medium">Trail Cams</Link>
            <Link href="#" className="hover:text-cream-100 transition">Journal</Link>
            <Link href="#" className="hover:text-cream-100 transition">Maps</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400/70 mb-3">Signature feature</p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-cream-50 mb-4">
            Mass Dump Trail Cam Reader
          </h1>
          <p className="text-cream-300/60 max-w-2xl text-lg leading-relaxed">
            Dump an entire SD card. Accurate EXIF, animal detection, empty-frame filtering,
            deer & buck tags with confidence — so you only look at what matters.
          </p>
        </div>

        {/* Upload zone */}
        <section className="mb-16">
          <div className="relative group rounded-3xl border border-dashed border-white/10 hover:border-amber-500/40 bg-gradient-to-b from-forest-900/80 to-forest-950/90 p-14 md:p-20 text-center transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-amber-400/[0.03] opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
            <div className="relative">
              <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-2xl group-hover:scale-110 transition duration-500">
                📷
              </div>
              <h2 className="text-xl font-medium text-cream-50 mb-2">Drop your trail cam photos here</h2>
              <p className="text-cream-300/50 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                Drag & drop hundreds of images, or select a folder. JPG, PNG, HEIC supported.
              </p>
              <button className="btn-primary text-sm">Select photos or folder</button>
              <p className="mt-5 text-xs text-cream-300/30">
                Processing runs in the background. You can leave this page.
              </p>
            </div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl text-cream-100 mb-8">How the accurate reader works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Mass Upload", desc: "Dump the whole card. Bulk files kept with original names." },
              { step: "02", title: "EXIF Extraction", desc: "Accurate date, time, camera model, GPS from metadata." },
              { step: "03", title: "Animal Detection", desc: "MegaDetector-class find animals, people, vehicles & empties." },
              { step: "04", title: "Deer Intelligence", desc: "Deer / buck / doe tags, confidence scores, smart filters." },
            ].map((item) => (
              <div key={item.step} className="card-premium p-6">
                <span className="text-xs font-medium text-amber-400/80 tracking-widest">{item.step}</span>
                <h3 className="mt-3 font-medium text-cream-50 mb-2">{item.title}</h3>
                <p className="text-sm text-cream-300/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Accuracy callout */}
        <section className="mb-16 rounded-2xl border border-moss-500/25 bg-gradient-to-br from-moss-600/10 to-transparent p-8">
          <h2 className="text-lg font-medium text-moss-400 mb-4">Built for accuracy, not hype</h2>
          <ul className="space-y-3 text-sm text-cream-300/70 leading-relaxed">
            <li>Primary detection inspired by Microsoft MegaDetector — the open-source standard used worldwide for camera-trap images.</li>
            <li>Empty frames auto-flagged so you stop scrolling blank night shots.</li>
            <li>Confidence scores shown. Human overrides always win.</li>
            <li>EXIF first — timelines and weather stay correct while analysis runs.</li>
            <li>Tuned for northern NS cams: day/night IR, typical resolution, whitetail, coyote, bear.</li>
          </ul>
        </section>

        {/* Gallery empty state */}
        <section className="mb-14">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="font-serif text-2xl text-cream-100">Your gallery</h2>
            <div className="flex flex-wrap gap-2">
              {["All", "Deer only", "Bucks", "Does", "Empty filtered", "Favorites"].map((f) => (
                <button
                  key={f}
                  className="px-3.5 py-1.5 rounded-full text-xs border border-white/10 text-cream-300/50 hover:border-amber-500/40 hover:text-amber-300 transition"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.05] bg-forest-950/60 p-20 text-center">
            <p className="text-cream-300/40 text-lg mb-2">No photos yet</p>
            <p className="text-cream-300/25 text-sm max-w-sm mx-auto">
              Dump your first SD card above. The reader will sort animals from empties and surface the deer.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-sm uppercase tracking-widest text-cream-300/40 mb-4">Coming next</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Timeline by hour / day / moon phase",
              "Same-buck matching across cameras",
              "Activity heatmaps from cam times",
              "Share album with hunting buddies",
              "Export filtered sets",
              "Link photos into Hunt Journal",
            ].map((f) => (
              <div
                key={f}
                className="px-4 py-3 rounded-xl border border-dashed border-white/[0.06] text-cream-300/35 text-sm"
              >
                {f}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
