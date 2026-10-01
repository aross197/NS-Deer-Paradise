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
import {
  PROXIMITY_RADIUS_KM,
  bandLabel,
  type NearbyHunterPublic,
} from "@/lib/proximity";

type Phase =
  | "ready"
  | "locating"
  | "ready-to-send"
  | "sending"
  | "sent"
  | "offline-saved"
  | "error";

const HOME: LatLon & { name: string } = {
  name: "Truck / home base",
  lat: 45.62,
  lon: -63.28,
};

/** Demo selected contacts — replace with real EmergencyContact list */
const DEMO_CONTACTS = [
  { id: "c1", name: "Spouse", selected: true },
  { id: "c2", name: "Hunting buddy — Ray", selected: true },
  { id: "c3", name: "Dad", selected: false },
];

/** Demo nearby hunters — server would compute distance only, never return their coords */
const DEMO_NEARBY: NearbyHunterPublic[] = [
  {
    displayName: "Hunter · opted in",
    distanceMetres: 4200,
    distanceLabel: "4.20 km",
    band: "under_5km",
  },
  {
    displayName: "Hunter · opted in",
    distanceMetres: 11800,
    distanceLabel: "11.80 km",
    band: "5_15km",
  },
  {
    displayName: "Hunter · opted in",
    distanceMetres: 22100,
    distanceLabel: "22.10 km",
    band: "15_25km",
  },
];

export default function SosPage() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [online, setOnline] = useState(true);
  const [position, setPosition] = useState<LatLon | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [bearingLabel, setBearingLabel] = useState("");
  const [distanceLabel, setDistanceLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [notifySelected, setNotifySelected] = useState(true);
  const [notifyProximity, setNotifyProximity] = useState(true);
  const [contacts, setContacts] = useState(DEMO_CONTACTS);
  const [nearby, setNearby] = useState<NearbyHunterPublic[]>([]);

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

  const toggleContact = (id: string) => {
    setContacts((list) =>
      list.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

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

        // In production: API returns nearby list with distance only (no lat/lon of others)
        setNearby(DEMO_NEARBY);

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
        try {
          const raw = localStorage.getItem("bucktracks_last_sos");
          if (raw) {
            const cached = JSON.parse(raw);
            setPosition({ lat: cached.lat, lon: cached.lon });
            setAccuracy(cached.accuracy ?? null);
            setBearingLabel(formatBearing(cached.bearing ?? 0));
            setDistanceLabel("(cached location)");
            setNearby(DEMO_NEARBY);
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

  const selectedCount = contacts.filter((c) => c.selected).length;

  const send = useCallback(async () => {
    if (!position) return;
    if (!notifySelected && !notifyProximity) {
      setError("Pick at least: selected people or 25 km proximity.");
      return;
    }
    if (notifySelected && selectedCount === 0) {
      setError("Select at least one person, or turn on proximity.");
      return;
    }

    setPhase("sending");
    setError(null);

    if (!navigator.onLine) {
      try {
        localStorage.setItem(
          "bucktracks_pending_sos",
          JSON.stringify({
            position,
            bearingLabel,
            distanceLabel,
            notifySelected,
            notifyProximity,
            contactIds: contacts.filter((c) => c.selected).map((c) => c.id),
            at: Date.now(),
          })
        );
      } catch {
        /* ignore */
      }
      setPhase("offline-saved");
      return;
    }

    try {
      // POST /api/safety/lost-alert
      // - Selected contacts: full location + back bearing + waypoints
      // - Proximity recipients (≤25km, opted in): distance only — NO exact location
      await new Promise((r) => setTimeout(r, 900));
      setPhase("sent");
    } catch {
      setError("Send failed. Call someone or try again.");
      setPhase("error");
    }
  }, [
    position,
    bearingLabel,
    distanceLabel,
    notifySelected,
    notifyProximity,
    contacts,
    selectedCount,
  ]);

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col px-4 pt-safe pb-safe">
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

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full pb-6">
        <p className="text-red-400 text-xs uppercase tracking-[0.3em] mb-2">SOS mode</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">I Am Lost</h1>
        <p className="text-white/50 text-sm mb-6 px-2">
          Notify people you choose and/or anyone opted-in within {PROXIMITY_RADIUS_KM} km.
          Nearby hunters see <strong className="text-white/70">distance only</strong> — never exact
          locations.
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
              <p className="text-white/40 text-xs mb-1">Your position (for selected contacts only)</p>
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

            {/* Who to notify */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
              <p className="text-xs uppercase tracking-wider text-white/40">Who gets notified</p>

              <label className="flex items-start gap-3 min-h-[44px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifySelected}
                  onChange={(e) => setNotifySelected(e.target.checked)}
                  className="mt-1.5 h-4 w-4 accent-red-500"
                />
                <span className="text-sm">
                  <span className="text-white font-medium">Selected people</span>
                  <span className="block text-white/40 text-xs mt-0.5">
                    Full GPS + back bearing + waypoints (your emergency list)
                  </span>
                </span>
              </label>

              {notifySelected && (
                <ul className="ml-7 space-y-2">
                  {contacts.map((c) => (
                    <li key={c.id}>
                      <label className="flex items-center gap-2 text-sm text-white/80 min-h-[40px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={c.selected}
                          onChange={() => toggleContact(c.id)}
                          className="h-4 w-4 accent-amber-500"
                        />
                        {c.name}
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              <label className="flex items-start gap-3 min-h-[44px] cursor-pointer pt-1 border-t border-white/5">
                <input
                  type="checkbox"
                  checked={notifyProximity}
                  onChange={(e) => setNotifyProximity(e.target.checked)}
                  className="mt-1.5 h-4 w-4 accent-red-500"
                />
                <span className="text-sm">
                  <span className="text-white font-medium">
                    Anyone within {PROXIMITY_RADIUS_KM} km (opted in)
                  </span>
                  <span className="block text-white/40 text-xs mt-0.5">
                    They only see how far you are — <strong>not</strong> your map pin or theirs
                  </span>
                </span>
              </label>
            </div>

            {/* Proximity list: distance only */}
            {notifyProximity && nearby.length > 0 && (
              <div className="rounded-2xl bg-sky-950/40 border border-sky-500/25 p-4">
                <p className="text-sky-300/90 text-xs uppercase tracking-wider mb-1">
                  Nearby (privacy mode)
                </p>
                <p className="text-white/45 text-xs mb-3">
                  {nearby.length} hunter{nearby.length !== 1 ? "s" : ""} within{" "}
                  {PROXIMITY_RADIUS_KM} km · proximity shown · location hidden
                </p>
                <ul className="space-y-2">
                  {nearby.map((n, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between text-sm gap-3 border-b border-white/5 last:border-0 pb-2 last:pb-0"
                    >
                      <span className="text-white/80 truncate">{n.displayName}</span>
                      <span className="text-sky-300/90 font-medium shrink-0 tabular-nums">
                        ~{n.distanceLabel}
                        <span className="text-white/30 font-normal text-xs ml-1">
                          ({bandLabel(n.band)})
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[10px] text-white/30 leading-relaxed">
                  Exact coordinates of other hunters are never shown. Exact coordinates of you are
                  only sent to people you select above.
                </p>
              </div>
            )}

            {notifyProximity && nearby.length === 0 && (
              <p className="text-xs text-white/35 px-1">
                No opted-in hunters currently within {PROXIMITY_RADIUS_KM} km (or presence data not
                loaded yet).
              </p>
            )}

            {error && <p className="text-amber-300 text-sm">{error}</p>}

            <button
              type="button"
              onClick={send}
              disabled={phase === "sending"}
              className="w-full min-h-[56px] rounded-2xl bg-red-600 active:bg-red-500 text-white text-lg font-bold touch-manipulation disabled:opacity-60"
            >
              {phase === "sending"
                ? "Sending…"
                : online
                  ? "SEND ALERT NOW"
                  : "SAVE FOR WHEN ONLINE"}
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
            <p className="text-white/50 text-sm leading-relaxed">
              {notifySelected && selectedCount > 0 && (
                <>
                  Selected contacts got your full location and back bearing ({bearingLabel}).
                  <br />
                </>
              )}
              {notifyProximity && (
                <>
                  Opted-in hunters within {PROXIMITY_RADIUS_KM} km were notified with{" "}
                  <strong className="text-white/70">distance only</strong> — not your exact pin.
                </>
              )}
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
              No signal. Alert is queued. When online, selected contacts and/or proximity network
              will be notified under the same privacy rules.
            </p>
            <p className="text-2xl text-emerald-300 font-semibold">{bearingLabel}</p>
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
        SOS helper only. Life-threatening emergency → 911 / SAR. Proximity is opt-in.
      </p>
    </div>
  );
}
