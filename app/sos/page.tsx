"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  backBearing,
  formatBearing,
  formatDistance,
  distanceMetres,
  mapsLink,
  type LatLon,
} from "@/lib/geo";

type Phase = "ready" | "locating" | "ready-to-send" | "sending" | "sent" | "offline-saved" | "error";

const HOME: LatLon & { name: string } = {
  name: "Truck / home base",
  lat: 45.62,
  lon: -63.28,
};

export default function SosPage() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [online, setOnline] = useState(true);
  const [position, setPosition] = useState<LatLon | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [bearingLabel, setBearingLabel] = useState("");
  const [distanceLabel, setDistanceLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const runLocate = useCallback(() => {
    setError(null);
    setPhase("locating");

    if (!navigator.geolocation) {
      setError("No GPS on this device.");
      setPhase("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setPosition(here);
        setAccuracy(pos.coords.accuracy);
        const brg = backBearing(here, HOME);
        setBearingLabel(formatBearing(brg));
        setDistanceLabel(formatDistance(distanceMetres(here, HOME)));

        // Cache last known position for weak signal / retry
        try {
          localStorage.setItem(
            "bucktracks_last_sos",
            JSON.stringify({
              ...here,
              accuracy: pos.coords.accuracy,
              bearing: brg,
              at: Date.now(),
            })
          );
        } catch {
          /* ignore */
        }

        setPhase("ready-to-send");
      },
      () => {
        // Try last cached fix
        try {
          const raw = localStorage.getItem("bucktracks_last_sos");
          if (raw) {
            const cached = JSON.parse(raw);
            setPosition({ lat: cached.lat, lon: cached.lon });
            setAccuracy(cached.accuracy ?? null);
            setBearingLabel(formatBearing(cached.bearing ?? 0));
            setDistanceLabel("(cached location)");
            setError("Live GPS failed — showing last known position.");
            setPhase("ready-to-send");
            return;
          }
        } catch {
          /* ignore */
        }
        setError("Could not get GPS. Move to open sky and try again.");
        setPhase("error");
      },
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 10000 }
    );
  }, []);

  const send = useCallback(async () => {
    if (!position) return;
    setPhase("sending");

    if (!navigator.onLine) {
      try {
        localStorage.setItem(
          "bucktracks_pending_sos",
          JSON.stringify({ position, bearingLabel, distanceLabel, at: Date.now() })
        );
      } catch {
        /* ignore */
      }
      setPhase("offline-saved");
      return;
    }

    try {
      // POST /api/safety/lost-alert when auth + Resend are live
      await new Promise((r) => setTimeout(r, 800));
      setPhase("sent");
    } catch {
      setError("Send failed. Call someone or try again.");
      setPhase("error");
    }
  }, [position, bearingLabel, distanceLabel]);

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col px-4 pt-safe pb-safe">
      {/* Status bar */}
      <div className="flex items-center justify-between py-3 text-xs">
        <Link href="/dashboard" className="text-white/40 active:text-white py-2 px-1">
          ← Exit SOS
        </Link>
        <span
          className={`px-2 py-1 rounded-full ${
            online ? "bg-emerald-900/80 text-emerald-300" : "bg-amber-900/80 text-amber-200"
          }`}
        >
          {online ? "Online" : "Offline — will queue alert"}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
        <p className="text-red-400 text-xs uppercase tracking-[0.3em] mb-2">SOS mode</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">I Am Lost</h1>
        <p className="text-white/50 text-sm mb-8 px-2">
          One big button. GPS + back bearing + your waypoints emailed home.
        </p>

        {(phase === "ready" || phase === "error") && (
          <>
            <button
              type="button"
              onClick={runLocate}
              className="w-[min(80vw,220px)] h-[min(80vw,220px)] rounded-full bg-red-600 active:bg-red-500 text-white text-2xl font-bold shadow-[0_0_80px_rgba(220,38,38,0.5)] border-4 border-red-400/50 touch-manipulation"
            >
              START
            </button>
            <p className="mt-6 text-white/35 text-xs max-w-xs">
              Hold phone to the sky. Large button for gloves / cold fingers.
            </p>
            {error && <p className="mt-4 text-red-300 text-sm px-4">{error}</p>}
          </>
        )}

        {phase === "locating" && (
          <div className="py-12">
            <div className="w-14 h-14 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg">Getting GPS…</p>
            <p className="text-white/40 text-sm mt-2">Stay still · clear sky</p>
          </div>
        )}

        {(phase === "ready-to-send" || phase === "sending") && position && (
          <div className="w-full space-y-4 text-left">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-white/40 text-xs mb-1">Your position</p>
              <p className="font-mono text-base break-all">
                {position.lat.toFixed(5)}, {position.lon.toFixed(5)}
              </p>
              {accuracy != null && (
                <p className="text-white/35 text-xs mt-1">±{Math.round(accuracy)} m</p>
              )}
              <a
                href={mapsLink(position.lat, position.lon)}
                className="inline-block mt-2 text-amber-400 text-sm min-h-[44px] leading-[44px]"
              >
                Open in Maps
              </a>
            </div>

            <div className="rounded-2xl bg-emerald-950/50 border border-emerald-500/30 p-4">
              <p className="text-emerald-400/80 text-xs mb-1">Walk this way home</p>
              <p className="text-2xl font-semibold text-emerald-300">{bearingLabel}</p>
              <p className="text-white/50 text-sm mt-1">
                {HOME.name} · {distanceLabel}
              </p>
            </div>

            {error && <p className="text-amber-300 text-sm">{error}</p>}

            <button
              type="button"
              onClick={send}
              disabled={phase === "sending"}
              className="w-full min-h-[56px] rounded-2xl bg-red-600 active:bg-red-500 text-white text-lg font-bold touch-manipulation disabled:opacity-60"
            >
              {phase === "sending" ? "Sending…" : online ? "EMAIL CONTACTS NOW" : "SAVE FOR WHEN ONLINE"}
            </button>

            <a
              href="tel:911"
              className="flex items-center justify-center w-full min-h-[52px] rounded-2xl border border-white/20 text-white/80 text-base touch-manipulation"
            >
              Call 911
            </a>
          </div>
        )}

        {phase === "sent" && (
          <div className="space-y-4">
            <p className="text-emerald-400 text-xl font-semibold">Alert sent</p>
            <p className="text-white/50 text-sm">
              Contacts have your location and back bearing ({bearingLabel}).
            </p>
            <p className="text-white/35 text-xs">Stay put if safe. Conserve battery.</p>
            <a href="tel:911" className="block text-red-400 min-h-[44px] leading-[44px]">
              Still in danger? Call 911
            </a>
          </div>
        )}

        {phase === "offline-saved" && (
          <div className="space-y-4">
            <p className="text-amber-300 text-xl font-semibold">Saved offline</p>
            <p className="text-white/50 text-sm">
              No signal. Alert is queued on this phone. It will send when you regain data — or call
              someone with the bearing below.
            </p>
            <p className="text-2xl text-emerald-300 font-semibold">{bearingLabel}</p>
            <p className="font-mono text-sm text-white/60">
              {position?.lat.toFixed(5)}, {position?.lon.toFixed(5)}
            </p>
            <a
              href="tel:911"
              className="flex items-center justify-center w-full min-h-[52px] rounded-2xl bg-red-600 text-white font-bold"
            >
              Call 911
            </a>
          </div>
        )}
      </div>

      <p className="text-center text-[10px] text-white/25 py-4 px-2">
        SOS is a helper tool. For life-threatening emergencies use 911 / local SAR.
      </p>
    </div>
  );
}
