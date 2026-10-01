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
import { PROXIMITY_RADIUS_KM, bandLabel, type NearbyHunterPublic } from "@/lib/proximity";
import {
  loadContacts,
  loadHomeBase,
  type StoredContact,
  type HomeBase,
} from "@/lib/local-store";

type Phase =
  | "ready"
  | "locating"
  | "ready-to-send"
  | "sending"
  | "sent"
  | "offline-saved"
  | "error";

export default function SosPage() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [online, setOnline] = useState(true);
  const [position, setPosition] = useState<LatLon | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [bearingLabel, setBearingLabel] = useState("");
  const [distanceLabel, setDistanceLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notifySelected, setNotifySelected] = useState(true);
  const [notifyProximity, setNotifyProximity] = useState(false);
  const [contacts, setContacts] = useState<StoredContact[]>([]);
  const [home, setHome] = useState<HomeBase | null>(null);
  const [nearby, setNearby] = useState<NearbyHunterPublic[]>([]);
  const [mailtoLinks, setMailtoLinks] = useState<string[]>([]);

  useEffect(() => {
    setContacts(loadContacts());
    setHome(loadHomeBase());
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const homePoint = home ?? { name: "Default (set in Settings)", lat: 45.62, lon: -63.28 };

  const toggleContact = (id: string) => {
    setContacts((list) =>
      list.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const runLocate = useCallback(() => {
    setError(null);
    setPhase("locating");
    setNearby([]);
    if (!navigator.geolocation) {
      setError("No GPS on this device.");
      setPhase("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        const h = loadHomeBase() ?? homePoint;
        setPosition(here);
        setAccuracy(pos.coords.accuracy);
        const brg = backBearing(here, h);
        setBearingLabel(formatBearing(brg));
        setDistanceLabel(formatDistance(distanceMetres(here, h)));
        try {
          localStorage.setItem(
            "bucktracks_last_sos",
            JSON.stringify({ ...here, accuracy: pos.coords.accuracy, bearing: brg, at: Date.now() })
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
            setDistanceLabel("(cached)");
            setError("Live GPS failed — last known position.");
            setPhase("ready-to-send");
            return;
          }
        } catch {
          /* ignore */
        }
        setError("Could not get GPS. Move to open sky.");
        setPhase("error");
      },
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
    );
  }, [homePoint]);

  const selected = contacts.filter((c) => c.selected);

  const send = useCallback(async () => {
    if (!position) return;
    if (!notifySelected && !notifyProximity) {
      setError("Choose selected people and/or proximity.");
      return;
    }
    if (notifySelected && selected.length === 0) {
      setError("Add contacts in Settings, or disable selected-people notify.");
      return;
    }
    setPhase("sending");
    setError(null);

    if (!navigator.onLine) {
      localStorage.setItem(
        "bucktracks_pending_sos",
        JSON.stringify({ position, notifySelected, notifyProximity, selected, at: Date.now() })
      );
      setPhase("offline-saved");
      return;
    }

    try {
      const res = await fetch("/api/safety/lost-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: position.lat,
          longitude: position.lon,
          accuracyMetres: accuracy,
          notifySelected,
          notifyProximity,
          contacts: selected.map((c) => ({ name: c.name, email: c.email })),
          homeLat: homePoint.lat,
          homeLon: homePoint.lon,
          homeName: homePoint.name,
          presence: [],
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Alert failed");
      setNearby(json.nearby ?? []);
      setMailtoLinks(json.mailtoLinks ?? []);
      if (json.mailtoLinks?.length) {
        window.location.href = json.mailtoLinks[0];
      }
      setPhase("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send failed");
      setPhase("error");
    }
  }, [
    position,
    accuracy,
    notifySelected,
    notifyProximity,
    selected,
    homePoint,
  ]);

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col px-4 pt-safe pb-safe">
      <div className="flex items-center justify-between py-3 text-xs">
        <Link href="/dashboard" className="text-white/40 py-2">
          ← Exit
        </Link>
        <Link href="/settings" className="text-amber-400/80 py-2">
          Settings
        </Link>
        <span
          className={`px-2 py-1 rounded-full ${
            online ? "bg-emerald-900/80 text-emerald-300" : "bg-amber-900/80 text-amber-200"
          }`}
        >
          {online ? "Online" : "Offline"}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full pb-6">
        <p className="text-red-400 text-xs uppercase tracking-[0.3em] mb-2">SOS</p>
        <h1 className="text-3xl font-bold mb-2">I Am Lost</h1>
        <p className="text-white/50 text-sm mb-6 px-2">
          Real GPS · real back bearing · email contacts you saved. Proximity uses live presence when
          available (distance only).
        </p>

        {!home && phase === "ready" && (
          <p className="text-amber-300/90 text-xs mb-4 px-2">
            Set home base in <Link href="/settings" className="underline">Settings</Link> for accurate
            walk-home bearing.
          </p>
        )}

        {(phase === "ready" || phase === "error") && (
          <>
            <button
              type="button"
              onClick={runLocate}
              className="w-[min(80vw,220px)] h-[min(80vw,220px)] rounded-full bg-red-600 text-white text-2xl font-bold border-4 border-red-400/50 touch-manipulation"
            >
              START
            </button>
            {error && <p className="mt-4 text-red-300 text-sm">{error}</p>}
          </>
        )}

        {phase === "locating" && (
          <div className="py-12">
            <div className="w-14 h-14 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
            <p>Getting GPS…</p>
          </div>
        )}

        {(phase === "ready-to-send" || phase === "sending") && position && (
          <div className="w-full space-y-4 text-left">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-white/40 text-xs mb-1">Your position</p>
              <p className="font-mono text-base">
                {position.lat.toFixed(5)}, {position.lon.toFixed(5)}
              </p>
              {accuracy != null && (
                <p className="text-xs text-white/35">±{Math.round(accuracy)} m</p>
              )}
              <a
                href={mapsLink(position.lat, position.lon)}
                className="text-amber-400 text-sm min-h-[44px] inline-flex items-center"
              >
                Open in Maps
              </a>
            </div>

            <div className="rounded-2xl bg-emerald-950/50 border border-emerald-500/30 p-4">
              <p className="text-emerald-400/80 text-xs mb-1">Walk this way home</p>
              <p className="text-2xl font-semibold text-emerald-300">{bearingLabel}</p>
              <p className="text-white/50 text-sm">
                {homePoint.name} · {distanceLabel}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
              <p className="text-xs uppercase text-white/40">Notify</p>
              <label className="flex gap-3 text-sm items-start">
                <input
                  type="checkbox"
                  checked={notifySelected}
                  onChange={(e) => setNotifySelected(e.target.checked)}
                  className="mt-1 accent-red-500"
                />
                <span>
                  Selected contacts (full location)
                  <span className="block text-xs text-white/40">
                    {contacts.length === 0
                      ? "None yet — add in Settings"
                      : `${selected.length} selected`}
                  </span>
                </span>
              </label>
              {notifySelected &&
                contacts.map((c) => (
                  <label key={c.id} className="flex gap-2 text-sm ml-6">
                    <input
                      type="checkbox"
                      checked={c.selected}
                      onChange={() => toggleContact(c.id)}
                      className="accent-amber-500"
                    />
                    {c.name} <span className="text-white/30 text-xs">{c.email}</span>
                  </label>
                ))}
              <label className="flex gap-3 text-sm items-start border-t border-white/5 pt-2">
                <input
                  type="checkbox"
                  checked={notifyProximity}
                  onChange={(e) => setNotifyProximity(e.target.checked)}
                  className="mt-1 accent-red-500"
                />
                <span>
                  Within {PROXIMITY_RADIUS_KM} km (opted-in)
                  <span className="block text-xs text-white/40">Distance only — needs live network</span>
                </span>
              </label>
            </div>

            {nearby.length > 0 && (
              <ul className="text-sm space-y-1 rounded-xl border border-sky-500/20 p-3">
                {nearby.map((n, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{n.displayName}</span>
                    <span className="text-sky-300">
                      ~{n.distanceLabel} ({bandLabel(n.band)})
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {error && <p className="text-amber-300 text-sm">{error}</p>}

            <button
              type="button"
              onClick={send}
              disabled={phase === "sending"}
              className="w-full min-h-[56px] rounded-2xl bg-red-600 font-bold text-lg disabled:opacity-60"
            >
              {phase === "sending" ? "Sending…" : "SEND ALERT NOW"}
            </button>
            <a
              href="tel:911"
              className="flex justify-center items-center w-full min-h-[52px] rounded-2xl border border-white/20"
            >
              Call 911
            </a>
          </div>
        )}

        {phase === "sent" && (
          <div className="space-y-3">
            <p className="text-emerald-400 text-xl font-semibold">Alert processed</p>
            <p className="text-white/50 text-sm">
              Bearing {bearingLabel}.{" "}
              {mailtoLinks.length
                ? "Mail app opened for first contact — send remaining from your email if needed."
                : "Add RESEND_API_KEY for automatic email, or use mailto from Settings contacts."}
            </p>
            <a href="tel:911" className="block text-red-400">
              Call 911 if needed
            </a>
          </div>
        )}

        {phase === "offline-saved" && (
          <div className="space-y-3">
            <p className="text-amber-300 text-xl font-semibold">Queued offline</p>
            <p className="text-2xl text-emerald-300">{bearingLabel}</p>
            <a href="tel:911" className="block text-red-400 font-bold">
              Call 911
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
