"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { WeatherBundle } from "@/lib/weather";
import { huntScore, NS_DEFAULT } from "@/lib/weather";

export default function WeatherPage() {
  const [data, setData] = useState<WeatherBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState(NS_DEFAULT.name);

  const load = useCallback(async (lat: number, lon: number, name: string) => {
    setLoading(true);
    setError(null);
    setLabel(name);
    try {
      const q = new URLSearchParams({
        lat: String(lat),
        lon: String(lon),
        label: name,
      });
      const res = await fetch(`/api/weather?${q}`);
      if (!res.ok) throw new Error("Weather request failed");
      const json = (await res.json()) as WeatherBundle;
      setData(json);
    } catch {
      setError("Could not load live weather. Check connection and retry.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(NS_DEFAULT.lat, NS_DEFAULT.lon, NS_DEFAULT.name);
  }, [load]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("GPS not available on this device.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        load(pos.coords.latitude, pos.coords.longitude, "Your GPS location");
      },
      () => {
        setError("Location permission denied or unavailable.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const score = data ? huntScore(data.current) : null;

  return (
    <div className="min-h-screen bg-deep text-cream-100">
      <nav className="sticky top-0 z-20 border-b border-white/[0.04] glass-strong">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg">
            BuckTracks
          </Link>
          <Link href="/dashboard" className="text-sm text-cream-300/50">
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-400/70 mb-1">Live weather</p>
            <h1 className="font-serif text-3xl text-cream-50">Hunt conditions</h1>
            <p className="text-sm text-cream-300/45 mt-1">{label}</p>
          </div>
          <button
            type="button"
            onClick={useMyLocation}
            className="btn-ghost text-sm py-2 px-4 min-h-[44px]"
          >
            Use my GPS
          </button>
        </div>

        {loading && (
          <p className="text-cream-300/50 py-16 text-center">Fetching Open-Meteo…</p>
        )}

        {error && !loading && (
          <p className="text-red-300 text-sm mb-4">{error}</p>
        )}

        {data && !loading && (
          <>
            <div className="card-premium p-6 mb-5">
              <p className="text-4xl font-medium text-cream-50">
                {Math.round(data.current.temperatureC)}°C
              </p>
              <p className="text-cream-300/70 mt-1">{data.current.weatherLabel}</p>
              <p className="text-sm text-cream-300/45 mt-2">
                Feels like {Math.round(data.current.feelsLikeC)}°C · Humidity{" "}
                {data.current.humidity}%
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-black/25 p-3">
                  <p className="text-cream-300/40 text-xs">Wind</p>
                  <p className="text-cream-100">
                    {Math.round(data.current.windKmh)} km/h {data.current.windCompass}
                  </p>
                  <p className="text-xs text-cream-300/35">
                    Gusts {Math.round(data.current.windGustKmh)} km/h
                  </p>
                </div>
                <div className="rounded-xl bg-black/25 p-3">
                  <p className="text-cream-300/40 text-xs">Pressure</p>
                  <p className="text-cream-100">{Math.round(data.current.pressureHpa)} hPa</p>
                  <p className="text-xs text-cream-300/35">
                    Cloud {data.current.cloudCover}% · Precip {data.current.precipitationMm} mm
                  </p>
                </div>
              </div>
              {score && (
                <div className="mt-4 rounded-xl border border-moss-500/25 bg-moss-500/10 p-3">
                  <p className="text-xs text-moss-400/80 uppercase tracking-wider">Hunt score</p>
                  <p className="text-2xl text-moss-400 font-medium">{score.score}/100</p>
                  <p className="text-xs text-cream-300/50">{score.note}</p>
                </div>
              )}
            </div>

            <h2 className="text-sm uppercase tracking-wider text-cream-300/40 mb-3">Next 24 hours</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
              {data.hourly.map((h) => (
                <div
                  key={h.time}
                  className="shrink-0 w-16 rounded-xl border border-white/5 bg-white/[0.03] p-2 text-center"
                >
                  <p className="text-[10px] text-cream-300/40">
                    {h.time.slice(11, 16)}
                  </p>
                  <p className="text-sm text-cream-100 my-1">{Math.round(h.temperatureC)}°</p>
                  <p className="text-[10px] text-cream-300/35">{Math.round(h.windKmh)}</p>
                </div>
              ))}
            </div>

            <h2 className="text-sm uppercase tracking-wider text-cream-300/40 mb-3">7-day</h2>
            <ul className="space-y-2">
              {data.daily.map((d) => (
                <li
                  key={d.date}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm"
                >
                  <div>
                    <p className="text-cream-100">{d.date}</p>
                    <p className="text-xs text-cream-300/40">{d.weatherLabel}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cream-100">
                      {Math.round(d.tempMaxC)}° / {Math.round(d.tempMinC)}°
                    </p>
                    <p className="text-xs text-cream-300/35">
                      Wind {Math.round(d.windMaxKmh)} · {d.precipitationMm} mm
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[10px] text-cream-300/25 text-center">
              Data: {data.source} · Updated {new Date(data.fetchedAt).toLocaleString()} · Attribution
              required (CC BY 4.0)
            </p>
          </>
        )}
      </main>
    </div>
  );
}
