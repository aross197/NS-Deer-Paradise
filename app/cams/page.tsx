import Link from "next/link";

export default function TrailCamsPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Nav */}
      <nav className="border-b border-stone-800 bg-stone-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-amber-500">
            🦌 NS Deer Paradise
          </Link>
          <div className="flex items-center gap-6 text-sm text-stone-300">
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/cams" className="text-amber-400 font-medium">Trail Cams</Link>
            <Link href="#" className="hover:text-white">Journal</Link>
            <Link href="#" className="hover:text-white">Maps</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Mass Dump Trail Cam Reader
          </h1>
          <p className="text-stone-400 max-w-2xl text-lg">
            Dump an entire SD card or folder. We read the photos accurately — EXIF timestamps,
            animal detection, empty-frame filtering, deer / buck tagging, and a clean gallery
            so you only look at what matters.
          </p>
        </div>

        {/* Upload zone */}
        <section className="mb-12">
          <div className="relative border-2 border-dashed border-stone-700 hover:border-amber-600/60 rounded-2xl bg-stone-900/50 p-12 text-center transition group">
            <div className="text-5xl mb-4 opacity-80 group-hover:scale-110 transition">📷</div>
            <h2 className="text-xl font-semibold mb-2">Drop your trail cam photos here</h2>
            <p className="text-stone-400 mb-6 max-w-md mx-auto">
              Drag & drop hundreds of images at once, or click to select a folder / multiple files.
              JPG, JPEG, PNG, HEIC supported.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold transition">
              Select Photos or Folder
            </button>
            <p className="mt-4 text-xs text-stone-500">
              Processing happens in the background. You can leave this page.
            </p>
          </div>
        </section>

        {/* How the accurate reader works */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-6">How the accurate reader works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                step: "1",
                title: "Mass Upload",
                desc: "Dump the whole card. We accept bulk files and keep original filenames.",
              },
              {
                step: "2",
                title: "EXIF Extraction",
                desc: "Accurate date, time, camera model, and any GPS pulled from the photo metadata.",
              },
              {
                step: "3",
                title: "Animal Detection",
                desc: "MegaDetector-class detection finds animals, people, vehicles and empty frames with confidence scores.",
              },
              {
                step: "4",
                title: "Deer Intelligence",
                desc: "Deer vs other, buck/doe tagging, optional antler point estimates, and smart filters.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-5 rounded-xl bg-stone-900 border border-stone-800"
              >
                <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
                  {item.step}
                </div>
                <h3 className="font-medium text-stone-100 mb-1">{item.title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Accuracy & tech note */}
        <section className="mb-14 p-6 rounded-2xl bg-emerald-950/30 border border-emerald-900/40">
          <h2 className="text-lg font-semibold text-emerald-300 mb-3">Built for accuracy, not hype</h2>
          <ul className="space-y-2 text-sm text-stone-300">
            <li>
              • Primary detection inspired by <strong>Microsoft MegaDetector</strong> — the open-source
              standard used by dozens of conservation programs worldwide for camera-trap images.
            </li>
            <li>
              • Empty frames are automatically flagged so you stop scrolling through blank night shots.
            </li>
            <li>
              • Confidence scores are shown. You can always override the AI — human decisions win.
            </li>
            <li>
              • EXIF timestamps are extracted first so your timeline and weather correlation stay correct
              even when the AI is still processing.
            </li>
            <li>
              • Designed for northern Nova Scotia trail cams: day/night IR, typical resolution, and the
              animals you actually see (whitetail, coyote, bear, etc.).
            </li>
          </ul>
        </section>

        {/* Filters preview (empty state) */}
        <section className="mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold">Your gallery</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              {["All", "Deer only", "Bucks", "Does", "Empty filtered", "Favorites"].map((f) => (
                <button
                  key={f}
                  className="px-3 py-1.5 rounded-full border border-stone-700 text-stone-400 hover:border-amber-600/50 hover:text-amber-400 transition"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-16 text-center">
            <p className="text-stone-500 text-lg mb-2">No photos yet</p>
            <p className="text-stone-600 text-sm">
              Dump your first SD card above. The accurate reader will sort animals from empty frames
              and surface the deer.
            </p>
          </div>
        </section>

        {/* Cool upcoming features */}
        <section>
          <h2 className="text-lg font-semibold text-stone-300 mb-4">Coming next on the reader</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            {[
              "Timeline view by hour / day / moon phase",
              "Same-buck matching across cameras",
              "Activity heatmaps from cam times",
              "One-click share album with hunting buddies",
              "Export filtered set (deer only, bucks only)",
              "Link photos straight into Hunt Journal entries",
            ].map((f) => (
              <div
                key={f}
                className="px-4 py-3 rounded-lg border border-dashed border-stone-700 text-stone-500"
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
