/**
 * Geodesy helpers for the "I Am Lost" safety feature.
 * Spherical Earth model — accurate enough for woods navigation in NS.
 */

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export interface LatLon {
  lat: number;
  lon: number;
}

/** Forward bearing from point A to point B (0–360°, clockwise from true north) */
export function forwardBearing(from: LatLon, to: LatLon): number {
  const φ1 = toRad(from.lat);
  const φ2 = toRad(to.lat);
  const Δλ = toRad(to.lon - from.lon);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

/** Back bearing: direction to walk to return toward the origin (reciprocal) */
export function backBearing(from: LatLon, toHome: LatLon): number {
  // Bearing from current position TO home is the way home
  return forwardBearing(from, toHome);
}

/** Reciprocal of a bearing (add 180, mod 360) */
export function reciprocalBearing(bearing: number): number {
  return (bearing + 180) % 360;
}

/** Distance in metres (Haversine) */
export function distanceMetres(a: LatLon, b: LatLon): number {
  const R = 6371000;
  const φ1 = toRad(a.lat);
  const φ2 = toRad(b.lat);
  const Δφ = toRad(b.lat - a.lat);
  const Δλ = toRad(b.lon - a.lon);

  const s =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function formatDistance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres)} m`;
  return `${(metres / 1000).toFixed(2)} km`;
}

/** Compass label e.g. N, NNE, NE ... */
export function bearingToCompass(bearing: number): string {
  const labels = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW",
  ];
  const idx = Math.round(bearing / 22.5) % 16;
  return labels[idx];
}

export function formatBearing(bearing: number): string {
  return `${bearing.toFixed(1)}° ${bearingToCompass(bearing)}`;
}

/** Google Maps / Apple Maps style link */
export function mapsLink(lat: number, lon: number): string {
  return `https://maps.google.com/?q=${lat.toFixed(6)},${lon.toFixed(6)}`;
}
