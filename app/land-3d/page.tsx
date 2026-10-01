import Link from "next/link";
import dynamic from "next/dynamic";

const Land3DViewer = dynamic(
  () => import("@/components/Land3DViewer").then((m) => m.Land3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[60vh] rounded-2xl border border-white/10 bg-forest-950 flex items-center justify-center text-cream-300/40">
        Loading 3D engine…
      </div>
    ),
  }
);

export default function Land3DPage() {
  return (
    <div className="min-h-screen bg-deep text-cream-100 flex flex-col">
      <nav className="sticky top-0 z-20 border-b border-white/[0.04] glass-strong">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg">
            BuckTracks
          </Link>
          <div className="flex gap-4 text-sm text-cream-300/60">
            <Link href="/weather" className="hover:text-cream-100">
              Weather
            </Link>
            <Link href="/cams" className="hover:text-cream-100">
              Cams
            </Link>
            <Link href="/land-3d" className="text-amber-400 font-medium">
              Land 3D
            </Link>
            <Link href="/sos" className="text-red-400">
              SOS
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 pb-16 flex flex-col">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400/70 mb-2">
            Terrain · Satellite · True north
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-cream-50 tracking-tight mb-2">
            Land 360°
          </h1>
          <p className="text-sm text-cream-300/55 max-w-2xl leading-relaxed">
            Accurate elevation under satellite imagery from your GPS. Map opens oriented to{" "}
            <strong className="text-cream-200">true north</strong>. Drag to look all the way around
            the ridges and valleys — built for reading the land before you walk it.
          </p>
        </div>

        <Land3DViewer className="flex-1" />

        <ul className="mt-6 grid sm:grid-cols-3 gap-3 text-xs text-cream-300/45">
          <li className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="text-cream-200/80">Elevation</span>
            <br />
            AWS Terrarium global DEM (real heights, not flat map)
          </li>
          <li className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="text-cream-200/80">Imagery</span>
            <br />
            Esri World Imagery (Maxar / Earthstar satellite)
          </li>
          <li className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="text-cream-200/80">Orientation</span>
            <br />
            Bearing 0° = north · compass HUD · one-tap re-north
          </li>
        </ul>
      </main>
    </div>
  );
}
