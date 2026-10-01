"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl, { Map, Marker, NavigationControl, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  buildLand3dStyle,
  NS_LAND_DEFAULT,
  STANDING_VIEW,
  circlePolygon,
} from "@/lib/land3d-style";
import {
  buildHeightGrid,
  scoreBedding,
  NS_PRESETS,
  loadDemTile,
  lngLatToWorld,
  terrariumHeight,
  type BedCandidate,
} from "@/lib/dem";
import { formatCoords, getPrecisionGps } from "@/lib/geo";

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

function setCircleSource(
  map: Map,
  id: string,
  lon: number,
  lat: number,
  radiusM: number,
  lineColor: string,
  fillColor: string,
  fillOpacity: number
) {
  const geo = {
    type: "FeatureCollection" as const,
    features: [circlePolygon(lon, lat, radiusM)],
  };
  if (map.getSource(id)) {
    (map.getSource(id) as maplibregl.GeoJSONSource).setData(geo);
    return;
  }
  map.addSource(id, { type: "geojson", data: geo });
  map.addLayer({
    id: `${id}-fill`,
    type: "fill",
    source: id,
    paint: { "fill-color": fillColor, "fill-opacity": fillOpacity },
  });
  map.addLayer({
    id: `${id}-line`,
    type: "line",
    source: id,
    paint: {
      "line-color": lineColor,
      "line-width": id === "gps-accuracy" ? 1.5 : 2,
      "line-opacity": 0.9,
      "line-dasharray": id === "gps-accuracy" ? [1, 1] : [2, 1.5],
    },
  });
}

function ensureRadiusLayer(map: Map, lon: number, lat: number) {
  setCircleSource(
    map,
    "radius-200",
    lon,
    lat,
    STANDING_VIEW.radiusMetres,
    "#e8a317",
    "#e8a317",
    0.07
  );
}

function ensureAccuracyLayer(map: Map, lon: number, lat: number, accuracyM: number) {
  if (!Number.isFinite(accuracyM) || accuracyM <= 0) return;
  setCircleSource(map, "gps-accuracy", lon, lat, accuracyM, "#38bdf8", "#38bdf8", 0.12);
}

async function sampleElevM(lon: number, lat: number): Promise<number | null> {
  try {
    const z = 14;
    const w = lngLatToWorld(lon, lat, z);
    const tile = await loadDemTile(z, Math.floor(w.x), Math.floor(w.y));
    const fx = w.x - Math.floor(w.x);
    const fy = w.y - Math.floor(w.y);
    const px = Math.min(tile.size - 1, Math.max(0, Math.floor(fx * tile.size)));
    const py = Math.min(tile.size - 1, Math.max(0, Math.floor(fy * tile.size)));
    const i = (py * tile.size + px) * 4;
    return terrariumHeight(tile.data[i], tile.data[i + 1], tile.data[i + 2]);
  } catch {
    return null;
  }
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
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [elevM, setElevM] = useState<number | null>(null);
  const [bearing, setBearing] = useState(0);
  const [pitch, setPitch] = useState(STANDING_VIEW.pitch);
  const [exaggeration, setExaggeration] = useState(STANDING_VIEW.exaggeration);
  const [basemap, setBasemap] = useState("imagery");
  const [status, setStatus] = useState(
    `Precision standing view · ${STANDING_VIEW.radiusMetres} m · loading…`
  );
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
      `<strong>Possible bed ${rank}</strong><br/>Score ${(spot.score * 100).toFixed(0)} / 100<br/>${spot.why}<br/><small>Terrain-only. DEM ~12–30 m.</small>`
    );
    const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([spot.lng, spot.lat])
      .setPopup(popup)
      .addTo(map);
    bedMarkersRef.current.push(marker);
  }, []);

  const standingView = useCallback(
    async (lat: number, lon: number, keepNorth = true, accuracyM?: number | null) => {
      const map = mapRef.current;
      if (!map) return;
      map.flyTo({
        center: [lon, lat],
        zoom: STANDING_VIEW.zoom,
        pitch: STANDING_VIEW.pitch,
        bearing: keepNorth ? 0 : map.getBearing(),
        essential: true,
        duration: 1400,
      });
      youMarkerRef.current?.setLngLat([lon, lat]);
      setCoords({ lat, lon });
      if (accuracyM != null) setGpsAccuracy(accuracyM);
      const apply = () => {
        ensureRadiusLayer(map, lon, lat);
        if (accuracyM != null && accuracyM > 0) {
          ensureAccuracyLayer(map, lon, lat, accuracyM);
        }
      };
      if (map.isStyleLoaded()) apply();
      else map.once("load", apply);
      const h = await sampleElevM(lon, lat);
      setElevM(h);
    },
    []
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildLand3dStyle(STANDING_VIEW.exaggeration),
      center: [NS_LAND_DEFAULT.lon, NS_LAND_DEFAULT.lat],
      zoom: STANDING_VIEW.zoom,
      pitch: STANDING_VIEW.pitch,
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
      ensureRadiusLayer(map, NS_LAND_DEFAULT.lon, NS_LAND_DEFAULT.lat);
      setStatus(
        `Gold = ${STANDING_VIEW.radiusMetres} m · cyan = GPS accuracy · true north · DEM elev at pin`
      );
      sampleElevM(NS_LAND_DEFAULT.lon, NS_LAND_DEFAULT.lat).then(setElevM);
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
      map.setStyle(buildLand3dStyle(exaggeration));
      map.once("style.load", () => {
        map.setTerrain({ source: "terrarium", exaggeration });
        ensureRadiusLayer(map, coords.lon, coords.lat);
        if (gpsAccuracy) ensureAccuracyLayer(map, coords.lon, coords.lat, gpsAccuracy);
      });
    }
  };

  const useGps = async () => {
    setGpsBusy(true);
    setStatus("High-accuracy GPS fix…");
    try {
      const fix = await getPrecisionGps(30000);
      await standingView(fix.lat, fix.lon, true, fix.accuracyMetres);
      const acc =
        fix.accuracyMetres != null ? `±${fix.accuracyMetres.toFixed(1)} m` : "±?";
      const alt =
        fix.altitudeMetres != null ? ` · alt ${fix.altitudeMetres.toFixed(1)} m` : "";
      setStatus(
        `Precision fix ${formatCoords(fix.lat, fix.lon, 7)} · GPS ${acc}${alt} · true north`
      );
    } catch {
      setStatus("GPS failed — open sky, enable high accuracy location");
    } finally {
      setGpsBusy(false);
    }
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
      await standingView(Number(r.lat), Number(r.lon), true, null);
      setStatus(
        `${r.display_name?.split(",").slice(0, 2).join(",") ?? "Found"} · ${formatCoords(Number(r.lat), Number(r.lon), 6)}`
      );
    } catch {
      setStatus("Search failed");
    }
  };

  const pinBeds = async () => {
    const map = mapRef.current;
    if (!map) return;
    setBedsBusy(true);
    setBedNote("Sampling DEM at max local zoom…");
    try {
      const b = map.getBounds();
      const z = Math.min(15, Math.max(13, Math.round(map.getZoom()) + 1));
      const grid = await buildHeightGrid(
        {
          west: b.getWest(),
          east: b.getEast(),
          south: b.getSouth(),
          north: b.getNorth(),
        },
        80,
        80,
        z
      );
      const spots = scoreBedding(grid);
      clearBeds();
      spots.forEach((s, i) => addBedPin(s, i + 1, map));
      setBedNote(
        spots.length
          ? `${spots.length} pins · DEM z${z} · terrain-only (not survey grade)`
          : "No strong terrain beds in this view."
      );
    } catch (err) {
      setBedNote(err instanceof Error ? err.message : "Could not score beds");
    } finally {
      setBedsBusy(false);
    }
  };

  const spinLook = () => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({
      bearing: map.getBearing() + 90,
      duration: 2500,
      easing: (t) => t * (2 - t),
    });
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div className="mb-3 flex flex-col sm:flex-row gap-2">
        <form onSubmit={runSearch} className="flex flex-1 gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a place…"
            className="flex-1 rounded-xl bg-forest-900 border border-white/10 px-3 py-2.5 text-sm text-cream-100"
          />
          <button type="submit" className="btn-primary text-sm px-4 min-h-[44px]">
            Go
          </button>
        </form>
        <div className="flex flex-wrap gap-1.5">
          {NS_PRESETS.slice(0, 4).map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                standingView(p.lat, p.lon, true, null);
                setStatus(`${p.name} · ${STANDING_VIEW.radiusMetres} m`);
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
              <p className="text-cream-50 font-medium tabular-nums">
                {(bearing % 360).toFixed(1)}° true
              </p>
              <p className="text-cream-300/50 tabular-nums">
                {STANDING_VIEW.radiusMetres} m
                {gpsAccuracy != null ? ` · GPS ±${gpsAccuracy.toFixed(1)} m` : ""}
                {elevM != null ? ` · ${elevM.toFixed(1)} m elev` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-4 right-4 z-10 flex flex-col gap-2">
        <p className="text-[11px] text-cream-100/80 bg-black/55 backdrop-blur px-3 py-2 rounded-xl max-w-xl font-mono">
          {status}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={useGps}
            disabled={gpsBusy}
            className="btn-primary text-xs py-2 px-3 min-h-[40px] disabled:opacity-50"
          >
            {gpsBusy ? "Fixing…" : "Precision GPS"}
          </button>
          <button
            type="button"
            onClick={() => standingView(coords.lat, coords.lon, true, gpsAccuracy)}
            className="btn-ghost text-xs py-2 px-3 min-h-[40px]"
          >
            Reset 200 m
          </button>
          <button
            type="button"
            onClick={() => mapRef.current?.easeTo({ bearing: 0, duration: 800 })}
            className="btn-ghost text-xs py-2 px-3 min-h-[40px]"
          >
            Face north
          </button>
          <button
            type="button"
            onClick={spinLook}
            className="btn-ghost text-xs py-2 px-3 min-h-[40px]"
          >
            Look 90°
          </button>
          <button
            type="button"
            onClick={pinBeds}
            disabled={bedsBusy}
            className="btn-ghost text-xs py-2 px-3 min-h-[40px] text-moss-400 disabled:opacity-50"
          >
            {bedsBusy ? "…" : "Pin beds"}
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
        </div>
        <p className="text-[10px] text-cream-300/40">{bedNote}</p>
      </div>

      <p className="mt-3 text-[10px] text-cream-300/30 text-center font-mono">
        {formatCoords(coords.lat, coords.lon, 7)}
        {elevM != null ? ` · DEM ${elevM.toFixed(1)} m` : ""} · Vincenty/WGS84 SOS · AWS
        Terrarium
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
          width: 26px;
          height: 32px;
          background: linear-gradient(180deg, #34d399, #059669);
          border-radius: 14px 14px 4px 14px;
          border: 2px solid #ecfdf5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #022c22;
          font-size: 11px;
          font-weight: 700;
          transform: rotate(-45deg);
        }
        .bed-pin span {
          transform: rotate(45deg);
        }
        .maplibregl-ctrl-group {
          background: rgba(12, 18, 16, 0.9) !important;
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
