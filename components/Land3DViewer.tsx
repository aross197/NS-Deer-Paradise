"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl, { Map, Marker, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildLand3dStyle, NS_LAND_DEFAULT } from "@/lib/land3d-style";

interface Props {
  className?: string;
}

export function Land3DViewer({ className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [coords, setCoords] = useState({
    lat: NS_LAND_DEFAULT.lat,
    lon: NS_LAND_DEFAULT.lon,
  });
  const [bearing, setBearing] = useState(0);
  const [pitch, setPitch] = useState(NS_LAND_DEFAULT.pitch);
  const [exaggeration, setExaggeration] = useState(1.35);
  const [status, setStatus] = useState("Loading 3D terrain…");
  const [gpsBusy, setGpsBusy] = useState(false);

  const flyTo = useCallback((lat: number, lon: number, keepNorth = true) => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [lon, lat],
      zoom: Math.max(map.getZoom(), 13.2),
      pitch: 68,
      bearing: keepNorth ? 0 : map.getBearing(),
      essential: true,
      duration: 1800,
    });
    markerRef.current?.setLngLat([lon, lat]);
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
      bearing: 0, // oriented true north
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
    el.title = "You are here";
    el.innerHTML =
      '<span class="land3d-you-pulse"></span><span class="land3d-you-dot"></span>';

    const marker = new maplibregl.Marker({ element: el, anchor: "center" })
      .setLngLat([NS_LAND_DEFAULT.lon, NS_LAND_DEFAULT.lat])
      .addTo(map);

    map.on("load", () => {
      setStatus("3D land ready · drag to look 360° · bearing 0° = north");
      // Soft atmosphere
      try {
        map.setSky({
          "sky-color": "#6fa8c9",
          "sky-horizon-blend": 0.12,
          "horizon-color": "#d4e2ec",
          "horizon-fog-blend": 0.75,
          "fog-color": "#b0c0cc",
          "fog-ground-blend": 0.4,
        });
      } catch {
        /* older maplibre */
      }
    });

    map.on("error", (e) => {
      console.error(e);
      setStatus("Map tile error — check network");
    });

    map.on("rotate", () => setBearing(map.getBearing()));
    map.on("pitch", () => setPitch(map.getPitch()));

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      marker.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    try {
      map.setTerrain({ source: "terrarium", exaggeration });
    } catch {
      /* style may still be loading */
    }
  }, [exaggeration]);

  const useGps = () => {
    if (!navigator.geolocation) {
      setStatus("GPS not available on this device");
      return;
    }
    setGpsBusy(true);
    setStatus("Getting GPS fix…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        flyTo(latitude, longitude, true);
        setStatus(
          `At ${latitude.toFixed(5)}, ${longitude.toFixed(5)} · oriented north · ±${Math.round(pos.coords.accuracy)} m`
        );
        setGpsBusy(false);
      },
      () => {
        setStatus("GPS failed — enable location and try again");
        setGpsBusy(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const resetNorth = () => {
    mapRef.current?.easeTo({ bearing: 0, duration: 800 });
  };

  const orbitHint = () => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({
      bearing: map.getBearing() + 90,
      duration: 2000,
      easing: (t) => t * (2 - t),
    });
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div
        ref={containerRef}
        className="w-full flex-1 min-h-[60vh] md:min-h-[72vh] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.45)]"
      />

      {/* Compass HUD */}
      <div className="pointer-events-none absolute top-4 left-4 z-10">
        <div className="glass-strong rounded-2xl px-3 py-2 text-xs text-cream-100/90">
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
              <p className="text-cream-300/50">
                Pitch {pitch.toFixed(0)}° · 0° = true north
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row gap-2 sm:items-end sm:justify-between">
        <p className="text-[11px] text-cream-100/80 bg-black/55 backdrop-blur px-3 py-2 rounded-xl max-w-md">
          {status}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={useGps}
            disabled={gpsBusy}
            className="btn-primary text-xs py-2 px-4 min-h-[44px] disabled:opacity-50"
          >
            {gpsBusy ? "Locating…" : "Use my location"}
          </button>
          <button
            type="button"
            onClick={resetNorth}
            className="btn-ghost text-xs py-2 px-4 min-h-[44px]"
          >
            Orient north
          </button>
          <button
            type="button"
            onClick={orbitHint}
            className="btn-ghost text-xs py-2 px-4 min-h-[44px]"
          >
            Orbit 90°
          </button>
        </div>
      </div>

      {/* Terrain exaggeration */}
      <div className="absolute top-4 right-14 z-10 glass-strong rounded-xl px-3 py-2 text-xs text-cream-100/80 hidden sm:block">
        <label className="flex flex-col gap-1">
          Relief ×{exaggeration.toFixed(2)}
          <input
            type="range"
            min={1}
            max={2.5}
            step={0.05}
            value={exaggeration}
            onChange={(e) => setExaggeration(parseFloat(e.target.value))}
            className="w-28 accent-amber-500"
          />
        </label>
      </div>

      <p className="mt-3 text-[10px] text-cream-300/30 text-center">
        {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)} · Satellite © Esri/Maxar · DEM © AWS
        Terrarium · MapLibre
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
        .maplibregl-ctrl-group {
          background: rgba(12, 18, 16, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .maplibregl-ctrl-group button {
          background-color: transparent !important;
        }
        .maplibregl-ctrl-attrib {
          background: rgba(0, 0, 0, 0.45) !important;
          color: rgba(255, 255, 255, 0.45) !important;
          font-size: 10px !important;
        }
      `}</style>
    </div>
  );
}
