"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  backBearing,
  formatBearing,
  formatDistance,
  distanceMetres,
  mapsLink,
  type LatLon,
} from "@/lib/geo";

type AlertPhase = "idle" | "locating" | "confirm" | "sending" | "sent" | "error";

// Demo waypoints until auth + DB are wired — replace with real user waypoints
const DEMO_HOME: LatLon & { name: string; id: string } = {
  id: "demo-truck",
  name: "Truck / Road (set your home base)",
  lat: 45.62,
  lon: -63.28,
};

const DEMO_WAYPOINTS = [
  DEMO_HOME,
  { id: "w1", name: "Stand — Ridge", lat: 45.631, lon: -63.295 },
  { id: "w2", name: "Cam 3 — Creek", lat: 45.618, lon: -63.271 },
];

export default function SafetyPage() {
  const [phase, setPhase] = useState<AlertPhase>("idle");
  const [position, setPosition] = useState<LatLon | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bearingInfo, setBearingInfo] = useState<{
    bearing: number;
    label: string;
    distance: string;
    homeName: string;
  } | null>(null);

  const locate = useCallback(() => {
    setErrorMsg(null);
    setPhase("locating");

    if (!navigator.geolocation) {
      setErrorMsg("GPS is not available on this device.");
      setPhase("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here: LatLon = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setPosition(here);
        setAccuracy(pos.coords.accuracy);

        const home = DEMO_HOME;
        const brg = backBearing(here, home);
        const dist = distanceMetres(here, home);

        setBearingInfo({
          bearing: brg,
          label: formatBearing(brg),
          distance: formatDistance(dist),
          homeName: home.name,
        });
        setPhase("confirm");
      },
      (err) => {
        setErrorMsg(
          err.code === 1
            ? "Location permission denied. Enable GPS and try again."
            : "Could not get GPS fix. Move to clearer sky and retry."
        );
        setPhase("error");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  }, []);

  const sendAlert = useCallback(async () => {
    if (!position || !bearingInfo) return;
    setPhase("sending");

    // When backend is live: POST /api/safety/lost-alert
    // Body includes lat/lon, back bearing, distance, all waypoints, maps link
    try {
      // Simulated send for UI — replace with real fetch + Resend email
      await new Promise((r) => setTimeout(r, 1200));
      setPhase("sent");
    } catch {
      setErrorMsg("Failed to send alert. Try again or call someone directly.");
      setPhase("error");
    }
  }, [position, bearingInfo]);

  return (
    <div className="min-h-screen bg-deep text-cream-100">
      <nav className="sticky top-0 z-20 border-b border-white/[0.04] glass-strong">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg tracking-wide">
            NS Deer Paradise
          </Link>
          <Link href="/dashboard" className="text-sm text-cream-300/50 hover:text-cream-100">
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-red-400/80 mb-3">
            Safety
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream-50 tracking-tight mb-4">
            I Am Lost
          </h1>
          <p className="text-cream-300/55 max-w-lg mx-auto leading-relaxed">
            One press captures your GPS, computes the <strong className="text-cream-200">back bearing</strong> to
            your home base (truck / road / camp), lists your waypoints, and emails your emergency contacts
            so they can talk you home.
          </p>
        </div>

        {/* Primary action */}
        {(phase === "idle" || phase === "error") && (
          <div className="flex flex-col items-center gap-6 mb-14">
            <button
              type="button"
              onClick={locate}
              className="w-48 h-48 rounded-full bg-gradient-to-b from-red-500 to-red-700 text-white font-semibold text-lg shadow-[0_0_60px_rgba(220,38,38,0.45)] hover:shadow-[0_0_80px_rgba(220,38,38,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border-4 border-red-400/30"
            >
              I AM LOST
            </button>
            <p className="text-xs text-cream-300/35 text-center max-w-xs">
              Requires GPS permission. Hold the phone with a clear view of the sky for best accuracy.
            </p>
            {errorMsg && (
              <p className="text-sm text-red-400/90 text-center max-w-sm">{errorMsg}</p>
            )}
          </div>
        )}

        {phase === "locating" && (
          <div className="text-center py-16 mb-14">
            <div className="inline-block w-12 h-12 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-4" />
            <p className="text-cream-200">Getting GPS fix…</p>
            <p className="text-sm text-cream-300/40 mt-2">Stay still with a clear sky view</p>
          </div>
        )}

        {(phase === "confirm" || phase === "sending") && position && bearingInfo && (
          <div className="space-y-6 mb-14">
            <div className="card-premium p-6 border-amber-500/20">
              <p className="text-xs uppercase tracking-wider text-cream-300/40 mb-3">Your position</p>
              <p className="font-mono text-lg text-cream-50">
                {position.lat.toFixed(5)}, {position.lon.toFixed(5)}
              </p>
              {accuracy != null && (
                <p className="text-sm text-cream-300/45 mt-1">
                  Accuracy ±{Math.round(accuracy)} m
                </p>
              )}
              <a
                href={mapsLink(position.lat, position.lon)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-amber-400 hover:text-amber-300"
              >
                Open in Maps →
              </a>
            </div>

            <div className="card-premium p-6 border-moss-500/25">
              <p className="text-xs uppercase tracking-wider text-moss-400/80 mb-3">
                Back bearing — walk this way home
              </p>
              <p className="text-3xl font-medium text-moss-400 mb-1">{bearingInfo.label}</p>
              <p className="text-cream-300/60">
                Toward <span className="text-cream-200">{bearingInfo.homeName}</span>
                {" · "}
                {bearingInfo.distance} away
              </p>
              <p className="text-xs text-cream-300/35 mt-3">
                True north bearing. Adjust for local magnetic declination if using a magnetic compass
                (Nova Scotia is typically ~17° W — verify for your area).
              </p>
            </div>

            <div className="card-premium p-6">
              <p className="text-xs uppercase tracking-wider text-cream-300/40 mb-3">
                Your waypoints (sent with alert)
              </p>
              <ul className="space-y-2 text-sm">
                {DEMO_WAYPOINTS.map((w) => (
                  <li key={w.id} className="flex justify-between gap-4 text-cream-300/70">
                    <span>{w.name}</span>
                    <span className="font-mono text-xs text-cream-300/40 shrink-0">
                      {w.lat.toFixed(4)}, {w.lon.toFixed(4)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={sendAlert}
                disabled={phase === "sending"}
                className="flex-1 py-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-semibold transition"
              >
                {phase === "sending" ? "Sending alert…" : "Email emergency contacts now"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhase("idle");
                  setPosition(null);
                  setBearingInfo(null);
                }}
                className="btn-ghost flex-1 py-4"
                disabled={phase === "sending"}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {phase === "sent" && position && bearingInfo && (
          <div className="card-premium p-8 text-center mb-14 border-moss-500/30">
            <p className="text-moss-400 text-lg font-medium mb-2">Alert sent</p>
            <p className="text-cream-300/60 text-sm mb-4">
              Your contacts received your location, back bearing ({bearingInfo.label}), distance
              ({bearingInfo.distance}), and waypoint list.
            </p>
            <p className="font-mono text-sm text-cream-300/50 mb-6">
              {position.lat.toFixed(5)}, {position.lon.toFixed(5)}
            </p>
            <p className="text-xs text-cream-300/35 mb-6">
              Stay put if safe. Conserve battery. Follow the back bearing only if you are sure of
              terrain and daylight.
            </p>
            <button
              type="button"
              onClick={() => {
                setPhase("idle");
                setPosition(null);
                setBearingInfo(null);
              }}
              className="btn-ghost text-sm"
            >
              Done
            </button>
          </div>
        )}

        {/* Setup checklist */}
        <section className="rounded-2xl border border-white/[0.06] bg-forest-950/50 p-6">
          <h2 className="font-medium text-cream-100 mb-4">Before you need this</h2>
          <ol className="space-y-3 text-sm text-cream-300/55 list-decimal list-inside">
            <li>Add emergency contacts (email required; phone optional) in settings.</li>
            <li>
              Mark your <strong className="text-cream-200">home base</strong> waypoint — truck, road
              access, or camp — so back bearing has a target.
            </li>
            <li>Save stands, cams, and parking as waypoints so rescuers see the full picture.</li>
            <li>Test GPS permission on this phone once before the season.</li>
          </ol>
          <p className="mt-5 text-xs text-cream-300/30">
            This tool helps share location and direction home. It is not a substitute for 911,
            a PLB, or local search and rescue. In a true emergency, call emergency services.
          </p>
        </section>
      </main>
    </div>
  );
}
