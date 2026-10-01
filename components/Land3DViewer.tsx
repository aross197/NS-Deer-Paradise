"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl, { Map, Marker, NavigationControl, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildLand3dStyle, NS_LAND_DEFAULT } from "@/lib/land3d-style";
import {
  buildHeightGrid,
  scoreBedding,
  NS_PRESETS,
  type BedCandidate,
} from "@/lib/dem";

const BASEMAPS: Record<
  string,
  { tiles: string[]; attribution: string; maxzoom?: number }
> = {
  imagery: {
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    attribution: "Tiles © Esri · Maxar · Earthstar",
    maxzoom: 19,
  },
  topo: {
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    ],
    attribution: "Tiles © Esri",
  },
  streets: {
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    ],
    attribution: "Tiles © Esri",
  },
  opentopo: {
    tiles: ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
    attribution: "© OpenStreetMap, SRTM — © OpenTopoMap (CC-BY-SA)",
  },
};

interface Props {
  className?: string;
}

export function Land3DViewer({ className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const youMarkerRef = useRef<Marker | null>(null);
  const bedMarkersRef = useRef<Marker[]>([]);
  const [coords, setCoords] = useState({
    lat: NS_LAND_DEFAULT.lat,
    lon: NS_LAND_DEFAULT.lon,
  });
  const [bearing, setBearing] = useState(0);
  const [pitch, setPitch] = useState(NS_LAND_DEFAULT.pitch);
  const [exaggeration, setExaggeration] = useState(1.35);
  const [basemap, setBasemap] = useState("imagery");
  const [status, setStatus] = useState("Loading 3D terrain…");
  const [search, setSearch] = useState("");
  const [gpsBusy, setGpsBusy] = useState(false);
  const [bedsBusy, setBedsBusy] = useState(false);
  const [bedNote, setBedNote] = useState(
    "Terrain-only: south-facing mid-slopes. Not cover, food, or pressure."
  );

  const clearBeds = useCallback(() => {
    bedMarkersRef.current.forEach((m) => m.remove());
    bedMarkersRef.current = [];
  }, []);

  const addBedPin = useCallback((spot: BedCandidate, rank: number, map: Map) => {
    const el = document.createElement("div");
    el.className = "bed-pin";
    el.innerHTML = `<span>${rank}</span>`;
    const popup = new Popup({ offset: 18 }).setHTML(
      `<strong>Possible bed ${rank}</strong><br/>Score ${(spot.score * 100).toFixed(0)} / 100<br/>${spot.why}<br/><small>Terrain-only guess. No cover or pressure data.</small>`
    );
    const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([spot.lng, spot.lat])
      .setPopup(popup)
      .addTo(map);
    bedMarkersRef.current.push(marker);
  }, []);

  const flyTo = useCallback((lat: number, lon: number, zoom = 13.2, keepNorth = true) => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [lon, lat],
      zoom,
      pitch: 68,
      bearing: keepNorth ? 0 : map.getBearing(),
      essential: true,
      duration: 1600,
    });
    youMarkerRef.current?.setLngLat([lon, lat]);
    setCoords({ lat, lon });
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildLand3dStyle(1.35),
      center: [NS_LAND_DEFAULT.lon, NS_LAND_DEFAULT.lat],
      zoom: NS_LAND_DEFAULT.zoom,
      pitch: NS_LAND_DEFAULT.pitch,
      bearing: 0,
      maxPitch: 85,
      antialias: true,
      fadeDuration: 0,
      attributionControl: true,
    });

    map.addControl(
      new NavigationControl({ visualizePitch: true, showCompass: true }),
      "top-right"
    );

    const el = document.createElement("div");
    el.className = "land3d-you-marker";
    el.innerHTML =
      '<span class="land3d-you-pulse"></span><span class="land3d-you-dot"></span>';
    const marker = new maplibregl.Marker({ element: el, anchor: "center" })
      .setLngLat([NS_LAND_DEFAULT.lon, NS_LAND_DEFAULT.lat])
      .addTo(map);

    map.on("load", () => {
      setStatus("3D land ready · drag 360° · 0° = north · inspired by Terraview");
    });
    map.on("rotate", () => setBearing(map.getBearing()));
    map.on("pitch", () => setPitch(map.getPitch()));

    mapRef.current = map;
    youMarkerRef.current = marker;

    return () => {
      clearBeds();
      marker.remove();
      map.remove();
      mapRef.current = null;
      youMarkerRef.current = null;
    };
  }, [clearBeds]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    try {
      map.setTerrain({ source: "terrarium", exaggeration });
    } catch {
      /* ignore */
    }
  }, [exaggeration]);

  const switchBasemap = (key: string) => {
    const map = mapRef.current;
    if (!map) return;
    const bm = BASEMAPS[key];
    if (!bm) return;
    setBasemap(key);
    const src = map.getSource("satellite") as maplibregl.RasterTileSource | undefined;
    if (src && "setTiles" in src) {
      (src as { setTiles: (t: string[]) => void }).setTiles(bm.tiles);
    } else {
      // rebuild style layer tiles via style mutation
      const style = map.getStyle();
      if (style?.sources?.satellite) {
        (style.sources.satellite as { tiles?: string[] }).tiles = bm.tiles;
        map.setStyle(buildLand3dStyle(exaggeration));
        map.once("style.load", () => {
          map.setTerrain({ source: "terrarium", exaggeration });
        });
      }
    }
  };

  const useGps = () => {
    if (!navigator.geolocation) {
      setStatus("GPS not available");
      return;
    }
    setGpsBusy(true);
    setStatus("Getting GPS…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        flyTo(pos.coords.latitude, pos.coords.longitude, 13.5, true);
        setStatus(
          `GPS ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} · north · ±${Math.round(pos.coords.accuracy)} m`
        );
        setGpsBusy(false);
      },
      () => {
        setStatus("GPS failed");
        setGpsBusy(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const runSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setStatus("Searching…");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(search.trim())}`,
        { headers: { Accept: "application/json" } }
      );
      const rows = await res.json();
      if (!rows.length) {
        setStatus("No match");
        return;
      }
      const r = rows[0];
      flyTo(Number(r.lat), Number(r.lon), 13, true);
      setStatus(`${r.display_name?.split(",").slice(0, 2).join(",") ?? "Found"}`);
    } catch {
      setStatus("Search failed");
    }
  };

  const pinBeds = async () => {
    const map = mapRef.current;
    if (!map) return;
    setBedsBusy(true);
    setBedNote("Reading slopes from DEM…");
    try {
      const b = map.getBounds();
      const z = Math.min(15, Math.max(12, Math.round(map.getZoom()) + 2));
      const grid = await buildHeightGrid(
        {
          west: b.getWest(),
          east: b.getEast(),
          south: b.getSouth(),
          north: b.getNorth(),
        },
        72,
        72,
        z
      );
      const spots = scoreBedding(grid);
      clearBeds();
      spots.forEach((s, i) => addBedPin(s, i + 1, map));
      setBedNote(
        spots.length
          ? `${spots.length} terrain pins (southish mid-slope, 3–30°). Cover, wind, and pressure still decide real beds.`
          : "No strong terrain beds in this view. Zoom into hills."
      );
    } catch (err) {
      setBedNote(
        err instanceof Error ? err.message : "Could not score beds"
      );
    } finally {
      setBedsBusy(false);
    }
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Search + presets */}
      <div className="mb-3 flex flex-col sm:flex-row gap-2">
        <form onSubmit={runSearch} className="flex flex-1 gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a place (Nominatim)…"
            className="flex-1 rounded-xl bg-forest-900 border border-white/10 px-3 py-2.5 text-sm text-cream-100"
          />
          <button type="submit" className="btn-primary text-sm px-4 min-h-[44px]">
            Go
          </button>
        </form>
        <div className="flex flex-wrap gap-1.5">
          {NS_PRESETS.slice(0, 5).map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                flyTo(p.lat, p.lon, p.zoom, true);
                setStatus(p.name);
              }}
              className="text-[11px] px-2.5 py-1.5 rounded-full border border-white/10 text-cream-300/60 hover:border-amber-500/40 hover:text-amber-300"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full flex-1 min-h-[55vh] md:min-h-[68vh] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.45)]"
      />

      <div className="pointer-events-none absolute top-[4.5rem] left-4 z-10 sm:top-24">
        <div className="glass-strong rounded-2xl px-3 py-2 text-xs text-cream-100/90 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/40 bg-black/40 font-semibold text-amber-300"
              style={{ transform: `rotate(${-bearing}deg)` }}
            >
              N
            </span>
            <div>
              <p className="text-cream-50 font-medium">
                Bearing {(bearing % 360).toFixed(0)}°
              </p>
              <p className="text-cream-300/50">Pitch {pitch.toFixed(0)}° · true north</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-4 right-4 z-10 flex flex-col gap-2">
        <p className="text-[11px] text-cream-100/80 bg-black/55 backdrop-blur px-3 py-2 rounded-xl max-w-xl">
          {status}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={useGps}
            disabled={gpsBusy}
            className="btn-primary text-xs py-2 px-3 min-h-[40px] disabled:opacity-50"
          >
            {gpsBusy ? "Locating…" : "My GPS"}
          </button>
          <button
            type="button"
            onClick={() => mapRef.current?.easeTo({ bearing: 0, duration: 800 })}
            className="btn-ghost text-xs py-2 px-3 min-h-[40px]"
          >
            Orient north
          </button>
          <button
            type="button"
            onClick={pinBeds}
            disabled={bedsBusy}
            className="btn-ghost text-xs py-2 px-3 min-h-[40px] border-moss-500/30 text-moss-400 disabled:opacity-50"
          >
            {bedsBusy ? "Reading slopes…" : "Pin likely beds"}
          </button>
          <button
            type="button"
            onClick={() => {
              clearBeds();
              setBedNote(
                "Terrain-only: south-facing mid-slopes. Not cover, food, or pressure."
              );
            }}
            className="btn-ghost text-xs py-2 px-3 min-h-[40px]"
          >
            Clear pins
          </button>
          <select
            value={basemap}
            onChange={(e) => switchBasemap(e.target.value)}
            className="text-xs rounded-lg bg-black/60 border border-white/15 px-2 py-2 text-cream-100"
          >
            <option value="imagery">Satellite</option>
            <option value="topo">Topo</option>
            <option value="streets">Streets</option>
            <option value="opentopo">OpenTopo</option>
          </select>
          <label className="text-[10px] text-cream-300/50 flex items-center gap-1">
            Relief
            <input
              type="range"
              min={1}
              max={2.5}
              step={0.05}
              value={exaggeration}
              onChange={(e) => setExaggeration(parseFloat(e.target.value))}
              className="w-20 accent-amber-500"
            />
            {exaggeration.toFixed(1)}×
          </label>
        </div>
        <p className="text-[10px] text-cream-300/40">{bedNote}</p>
      </div>

      <p className="mt-3 text-[10px] text-cream-300/30 text-center">
        {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)} · DEM AWS Terrarium · MapLibre · Land view
        inspired by{" "}
        <a
          href="https://glargod.github.io/terraview/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400/70 hover:text-amber-300 underline"
        >
          Terraview by Glargod
        </a>
      </p>

      <style jsx global>{`
        .land3d-you-marker {
          position: relative;
          width: 28px;
          height: 28px;
        }
        .land3d-you-dot {
          position: absolute;
          inset: 8px;
          border-radius: 9999px;
          background: #e8a317;
          border: 2px solid #fff;
          box-shadow: 0 0 12px rgba(232, 163, 23, 0.8);
        }
        .land3d-you-pulse {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 2px solid rgba(232, 163, 23, 0.6);
          animation: land3d-pulse 2s ease-out infinite;
        }
        @keyframes land3d-pulse {
          0% {
            transform: scale(0.6);
            opacity: 1;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        .bed-pin {
          width: 28px;
          height: 34px;
          background: linear-gradient(180deg, #34d399, #059669);
          border-radius: 14px 14px 4px 14px;
          border: 2px solid #ecfdf5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #022c22;
          font-size: 11px;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.45);
          transform: rotate(-45deg);
        }
        .bed-pin span {
          transform: rotate(45deg);
        }
        .maplibregl-ctrl-group {
          background: rgba(12, 18, 16, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .maplibregl-popup-content {
          background: #0f1614 !important;
          color: #e8ebe4 !important;
          border-radius: 12px !important;
          font-size: 12px !important;
        }
      `}</style>
    </div>
  );
}
