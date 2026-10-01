import { NextRequest, NextResponse } from "next/server";
import { fetchWeather, NS_DEFAULT } from "@/lib/weather";

export const dynamic = "force-dynamic";

/**
 * GET /api/weather?lat=&lon=&label=
 * Live forecast from Open-Meteo. Defaults to Truro, NS.
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const lat = parseFloat(sp.get("lat") ?? String(NS_DEFAULT.lat));
    const lon = parseFloat(sp.get("lon") ?? String(NS_DEFAULT.lon));
    const label = sp.get("label") ?? NS_DEFAULT.name;

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return NextResponse.json({ error: "Coordinates out of range" }, { status: 400 });
    }

    const weather = await fetchWeather(lat, lon, label);
    return NextResponse.json(weather, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    console.error("weather api", e);
    return NextResponse.json(
      { error: "Failed to fetch weather from Open-Meteo" },
      { status: 502 }
    );
  }
}
