"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { WeatherBundle } from "@/lib/weather";
import { huntScore } from "@/lib/weather";

export function WeatherCard() {
  const [data, setData] = useState<WeatherBundle | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => {
        if (!r.ok) throw new Error("fail");
        return r.json();
      })
      .then((j) => setData(j))
      .catch(() => setErr(true));
  }, []);

  if (err) {
    return (
      <Link href="/weather" className="card-premium p-6 block border-sky-500/20">
        <p className="text-xs uppercase text-sky-400/70 mb-2">Weather</p>
        <p className="text-cream-300/50 text-sm">Tap to load live forecast</p>
      </Link>
    );
  }

  if (!data) {
    return (
      <div className="card-premium p-6 border-sky-500/20">
        <p className="text-xs uppercase text-sky-400/70 mb-2">Weather</p>
        <p className="text-cream-300/40 text-sm">Loading Open-Meteo…</p>
      </div>
    );
  }

  const score = huntScore(data.current);

  return (
    <Link href="/weather" className="card-premium p-6 block border-sky-500/20 hover:border-sky-400/40">
      <p className="text-xs uppercase tracking-wider text-sky-400/70 mb-2">Live weather</p>
      <p className="text-2xl font-medium text-cream-50">
        {Math.round(data.current.temperatureC)}°C
      </p>
      <p className="text-sm text-cream-300/60 mt-1">
        {data.current.weatherLabel} · {Math.round(data.current.windKmh)} km/h{" "}
        {data.current.windCompass}
      </p>
      <p className="text-xs text-moss-400/80 mt-2">Hunt score {score.score}/100</p>
      <p className="text-[10px] text-cream-300/30 mt-1">{data.locationLabel} · Open-Meteo</p>
    </Link>
  );
}
