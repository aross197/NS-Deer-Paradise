"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  analyzeTrailCamFile,
  filterAnalyses,
  loadDetector,
  type GalleryFilter,
  type TrailCamAnalysis,
} from "@/lib/trailcam-ai";

export default function TrailCamsPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<TrailCamAnalysis[]>([]);
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [running, setRunning] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) =>
      /image\/(jpeg|jpg|png|webp|gif)/i.test(f.type) ||
      /\.(jpe?g|png|webp|gif)$/i.test(f.name)
    );
    if (list.length === 0) {
      setError("No supported images found (JPG, PNG, WebP)." );
      return;
    }

    setError(null);
    setRunning(true);
    setProgress({ done: 0, total: list.length });
    setStatus("Loading detection model (TensorFlow.js COCO-SSD)…");

    try {
      const model = await loadDetector();
      setModelReady(true);
      setStatus(`Analyzing ${list.length} image(s)…`);

      const results: TrailCamAnalysis[] = [];
      for (let i = 0; i < list.length; i++) {
        const file = list[i];
        try {
          const analysis = await analyzeTrailCamFile(file, model);
          results.push(analysis);
        } catch (e) {
          console.error(file.name, e);
        }
        setProgress({ done: i + 1, total: list.length });
        setStatus(`Analyzed ${i + 1} / ${list.length}`);
      }

      setItems((prev) => [...results, ...prev]);
      const animals = results.filter((r) => r.hasAnimal).length;
      const empty = results.filter((r) => r.isEmpty).length;
      setStatus(
        `Done. ${results.length} images · ${animals} with animals · ${empty} empty`
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to load AI model. Check network (model downloads once)."
      );
      setStatus(null);
    } finally {
      setRunning(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) runFiles(e.dataTransfer.files);
  };

  const visible = filterAnalyses(items, filter);
  const stats = {
    total: items.length,
    animals: items.filter((i) => i.hasAnimal).length,
    empty: items.filter((i) => i.isEmpty).length,
    deer: items.filter((i) => i.likelyDeer).length,
    people: items.filter((i) => i.hasPerson).length,
  };

  return (
    <div className="min-h-screen bg-deep text-cream-100">
      <nav className="sticky top-0 z-20 border-b border-white/[0.04] glass-strong">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg">
            BuckTracks
          </Link>
          <div className="flex gap-4 text-sm text-cream-300/60">
            <Link href="/weather" className="hover:text-cream-100">
              Weather
            </Link>
            <Link href="/cams" className="text-amber-400 font-medium">
              Trail Cams
            </Link>
            <Link href="/sos" className="text-red-400">
              SOS
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-24">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400/70 mb-2">
            Trail cam AI
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-cream-50 mb-2">
            Mass Dump Reader
          </h1>
          <p className="text-cream-300/55 max-w-2xl text-sm leading-relaxed">
            Real on-device detection with TensorFlow.js (COCO-SSD). Finds animals, people, and
            vehicles; flags empty frames; reads EXIF. Runs in your browser — photos stay on your
            device.
          </p>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="relative rounded-3xl border border-dashed border-white/10 hover:border-amber-500/40 bg-gradient-to-b from-forest-900/80 to-forest-950/90 p-10 md:p-16 text-center mb-8"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && runFiles(e.target.files)}
          />
          <p className="text-xl text-cream-50 mb-2">Drop trail cam photos</p>
          <p className="text-sm text-cream-300/45 mb-6">or select many at once from your SD dump</p>
          <button
            type="button"
            disabled={running}
            onClick={() => inputRef.current?.click()}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {running ? "Analyzing…" : "Select photos"}
          </button>
          {running && progress.total > 0 && (
            <div className="mt-6 max-w-md mx-auto">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all"
                  style={{
                    width: `${Math.round((progress.done / progress.total) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-cream-300/50 mt-2">{status}</p>
            </div>
          )}
          {!running && status && (
            <p className="mt-4 text-sm text-moss-400/90">{status}</p>
          )}
          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          {modelReady && !running && (
            <p className="mt-3 text-xs text-cream-300/30">Model loaded in memory</p>
          )}
        </div>

        {items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              ["Total", stats.total],
              ["Animals", stats.animals],
              ["Likely deer/mammal", stats.deer],
              ["Empty", stats.empty],
            ].map(([label, n]) => (
              <div key={String(label)} className="card-premium p-4 text-center">
                <p className="text-2xl text-cream-50">{n}</p>
                <p className="text-xs text-cream-300/40">{label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {(
            [
              ["all", "All"],
              ["nonempty", "Non-empty"],
              ["animals", "Animals"],
              ["deer", "Deer hint"],
              ["empty", "Empty only"],
              ["people", "People"],
            ] as [GalleryFilter, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`px-3.5 py-1.5 rounded-full text-xs border transition ${
                filter === id
                  ? "border-amber-500/50 text-amber-300 bg-amber-500/10"
                  : "border-white/10 text-cream-300/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.05] p-16 text-center text-cream-300/35 text-sm">
            {items.length === 0
              ? "Upload photos to run AI detection."
              : "No images match this filter."}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((item) => (
              <article key={item.id} className="card-premium overflow-hidden">
                <div className="aspect-[4/3] bg-black/40 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.objectUrl}
                    alt={item.fileName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {item.isEmpty && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/70 text-cream-300/70">
                        Empty
                      </span>
                    )}
                    {item.hasAnimal && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-moss-600/90 text-white">
                        Animal {(item.maxConfidence * 100).toFixed(0)}%
                      </span>
                    )}
                    {item.likelyDeer && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/90 text-stone-950">
                        Deer hint
                      </span>
                    )}
                    {item.hasPerson && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/90 text-white">
                        Person
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-cream-100 truncate">{item.fileName}</p>
                  <p className="text-xs text-cream-300/45 mt-1">
                    {item.speciesHint ?? "—"}
                    {item.exif.takenAt
                      ? ` · ${new Date(item.exif.takenAt).toLocaleString()}`
                      : ""}
                  </p>
                  {(item.exif.make || item.exif.model) && (
                    <p className="text-[10px] text-cream-300/30 mt-0.5">
                      {[item.exif.make, item.exif.model].filter(Boolean).join(" ")}
                    </p>
                  )}
                  <p className="text-[10px] text-cream-300/25 mt-2 line-clamp-2">{item.notes}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-10 text-xs text-cream-300/25 leading-relaxed max-w-2xl">
          Engine: TensorFlow.js COCO-SSD (lite MobileNet). Maps to MegaDetector-style classes
          (animal / person / vehicle / empty). Species ID for whitetail is a hint, not a guarantee —
          for research-grade MD, connect a PytorchWildlife MegaDetector service later. Photos never
          leave your browser in this mode.
        </p>
      </main>
    </div>
  );
}
