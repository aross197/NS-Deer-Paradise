/**
 * Precision geodesy for SOS + Land 3D.
 * WGS84 ellipsoid (Vincenty) for distance/bearing — not a flat-Earth approx.
 * Good for woods navigation across Nova Scotia distances.
 */

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/** WGS84 */
const WGS84_A = 6378137.0;
const WGS84_F = 1 / 298.257223563;
const WGS84_B = WGS84_A * (1 - WGS84_F);

export interface LatLon {
  lat: number;
  lon: number;
}

export interface GpsFix extends LatLon {
  accuracyMetres: number | null;
  altitudeMetres: number | null;
  altitudeAccuracyMetres: number | null;
  headingDeg: number | null;
  speedMps: number | null;
  timestamp: number;
}

/**
 * Vincenty inverse — distance (m) and forward azimuth from A→B on WGS84.
 * Falls back to Haversine if non-convergent (antipodal edge cases).
 */
export function vincentyInverse(
  from: LatLon,
  to: LatLon
): { distanceM: number; forwardBearingDeg: number; backBearingDeg: number } {
  const φ1 = toRad(from.lat);
  const φ2 = toRad(to.lat);
  const L = toRad(to.lon - from.lon);
  const tanU1 = (1 - WGS84_F) * Math.tan(φ1);
  const cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1);
  const sinU1 = tanU1 * cosU1;
  const tanU2 = (1 - WGS84_F) * Math.tan(φ2);
  const cosU2 = 1 / Math.sqrt(1 + tanU2 * tanU2);
  const sinU2 = tanU2 * cosU2;

  let λ = L;
  let λPrev = 0;
  let iter = 0;
  let sinλ = 0;
  let cosλ = 0;
  let sinσ = 0;
  let cosσ = 0;
  let σ = 0;
  let sinα = 0;
  let cos2α = 0;
  let cos2σm = 0;
  let C = 0;

  do {
    sinλ = Math.sin(λ);
    cosλ = Math.cos(λ);
    const sinSqσ =
      cosU2 * sinλ * (cosU2 * sinλ) +
      (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) *
        (cosU1 * sinU2 - sinU1 * cosU2 * cosλ);
    sinσ = Math.sqrt(sinSqσ);
    if (sinσ === 0) {
      return { distanceM: 0, forwardBearingDeg: 0, backBearingDeg: 0 };
    }
    cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
    σ = Math.atan2(sinσ, cosσ);
    sinα = (cosU1 * cosU2 * sinλ) / sinσ;
    cos2α = 1 - sinα * sinα;
    cos2σm = cos2α !== 0 ? cosσ - (2 * sinU1 * sinU2) / cos2α : 0;
    C = (WGS84_F / 16) * cos2α * (4 + WGS84_F * (4 - 3 * cos2α));
    λPrev = λ;
    λ =
      L +
      (1 - C) *
        WGS84_F *
        sinα *
        (σ +
          C *
            sinσ *
            (cos2σm + C * cosσ * (-1 + 2 * cos2σm * cos2σm)));
  } while (Math.abs(λ - λPrev) > 1e-12 && ++iter < 100);

  if (iter >= 100) {
    // rare: fall back
    const d = haversineMetres(from, to);
    const brg = forwardBearingHaversine(from, to);
    return {
      distanceM: d,
      forwardBearingDeg: brg,
      backBearingDeg: (brg + 180) % 360,
    };
  }

  const uSq = (cos2α * (WGS84_A * WGS84_A - WGS84_B * WGS84_B)) / (WGS84_B * WGS84_B);
  const A =
    1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const Δσ =
    B *
    sinσ *
    (cos2σm +
      (B / 4) *
        (cosσ * (-1 + 2 * cos2σm * cos2σm) -
          (B / 6) *
            cos2σm *
            (-3 + 4 * sinσ * sinσ) *
            (-3 + 4 * cos2σm * cos2σm)));

  const distanceM = WGS84_B * A * (σ - Δσ);
  const α1 = Math.atan2(cosU2 * sinλ, cosU1 * sinU2 - sinU1 * cosU2 * cosλ);
  const α2 = Math.atan2(cosU1 * sinλ, -sinU1 * cosU2 + cosU1 * sinU2 * cosλ);

  return {
    distanceM,
    forwardBearingDeg: (toDeg(α1) + 360) % 360,
    backBearingDeg: (toDeg(α2) + 360) % 360,
  };
}

function haversineMetres(a: LatLon, b: LatLon): number {
  const R = 6371008.8; // mean Earth radius (IUGG)
  const φ1 = toRad(a.lat);
  const φ2 = toRad(b.lat);
  const Δφ = toRad(b.lat - a.lat);
  const Δλ = toRad(b.lon - a.lon);
  const s =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

function forwardBearingHaversine(from: LatLon, to: LatLon): number {
  const φ1 = toRad(from.lat);
  const φ2 = toRad(to.lat);
  const Δλ = toRad(to.lon - from.lon);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Forward bearing A→B (true north, degrees) — Vincenty */
export function forwardBearing(from: LatLon, to: LatLon): number {
  return vincentyInverse(from, to).forwardBearingDeg;
}

/** Direction to walk toward home from current position */
export function backBearing(from: LatLon, toHome: LatLon): number {
  return forwardBearing(from, toHome);
}

export function reciprocalBearing(bearing: number): number {
  return (bearing + 180) % 360;
}

/** Distance metres — Vincenty on WGS84 */
export function distanceMetres(a: LatLon, b: LatLon): number {
  return vincentyInverse(a, b).distanceM;
}

export function formatDistance(metres: number): string {
  if (!Number.isFinite(metres)) return "—";
  if (metres < 1000) return `${metres < 10 ? metres.toFixed(1) : Math.round(metres)} m`;
  return `${(metres / 1000).toFixed(3)} km`;
}

export function bearingToCompass(bearing: number): string {
  const labels = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW",
  ];
  return labels[Math.round(bearing / 22.5) % 16];
}

/** High-precision bearing label */
export function formatBearing(bearing: number, decimals = 1): string {
  const b = ((bearing % 360) + 360) % 360;
  return `${b.toFixed(decimals)}° ${bearingToCompass(b)}`;
}

/** Format coords for display / sharing — 6 dp ≈ 0.11 m at equator */
export function formatCoords(lat: number, lon: number, dp = 6): string {
  return `${lat.toFixed(dp)}, ${lon.toFixed(dp)}`;
}

export function mapsLink(lat: number, lon: number): string {
  return `https://maps.google.com/?q=${lat.toFixed(7)},${lon.toFixed(7)}`;
}

/** Best-effort high-accuracy GPS fix */
export function getPrecisionGps(timeoutMs = 25000): Promise<GpsFix> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not available"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracyMetres: pos.coords.accuracy ?? null,
          altitudeMetres: pos.coords.altitude ?? null,
          altitudeAccuracyMetres: pos.coords.altitudeAccuracy ?? null,
          headingDeg: pos.coords.heading ?? null,
          speedMps: pos.coords.speed ?? null,
          timestamp: pos.timestamp,
        });
      },
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 0,
      }
    );
  });
}

/** Nova Scotia magnetic declination approx (east) — adjust magnetic compass */
export const NS_MAG_DECLINATION_EAST_DEG = 17;

export function trueToMagnetic(trueBearing: number, declEast = NS_MAG_DECLINATION_EAST_DEG): number {
  return (trueBearing - declEast + 360) % 360;
}
