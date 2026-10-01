import { distanceMetres, formatDistance, type LatLon } from "./geo";

/** Radius for nearby hunter SOS broadcast */
export const PROXIMITY_RADIUS_KM = 25;
export const PROXIMITY_RADIUS_M = PROXIMITY_RADIUS_KM * 1000;

export interface NearbyHunterPublic {
  /** Display name only — no coordinates */
  displayName: string;
  /** Distance from the lost hunter in metres */
  distanceMetres: number;
  distanceLabel: string;
  /** Coarse band for UI (never precise enough to triangulate alone) */
  band: "under_5km" | "5_15km" | "15_25km";
}

export function distanceBand(metres: number): NearbyHunterPublic["band"] {
  if (metres < 5000) return "under_5km";
  if (metres < 15000) return "5_15km";
  return "15_25km";
}

export function bandLabel(band: NearbyHunterPublic["band"]): string {
  switch (band) {
    case "under_5km":
      return "Under 5 km";
    case "5_15km":
      return "5–15 km";
    default:
      return "15–25 km";
  }
}

/**
 * Build privacy-safe nearby list.
 * Input may include lat/lon server-side only; output never includes coordinates.
 */
export function toPublicNearby(
  lostAt: LatLon,
  candidates: { displayName: string; lat: number; lon: number }[]
): NearbyHunterPublic[] {
  return candidates
    .map((c) => {
      const d = distanceMetres(lostAt, { lat: c.lat, lon: c.lon });
      return {
        displayName: c.displayName,
        distanceMetres: d,
        distanceLabel: formatDistance(d),
        band: distanceBand(d),
      };
    })
    .filter((c) => c.distanceMetres <= PROXIMITY_RADIUS_M)
    .sort((a, b) => a.distanceMetres - b.distanceMetres);
}

/**
 * What nearby hunters receive: alert exists + approximate distance to the lost person.
 * Exact lat/lon of the lost hunter is NOT included in proximity broadcasts.
 * Selected emergency contacts still get full coords via the normal email path.
 */
export function proximityAlertPayload(distanceFromYouMetres: number) {
  return {
    type: "lost_nearby" as const,
    message: "A BuckTracks hunter nearby activated I Am Lost.",
    distanceLabel: formatDistance(distanceFromYouMetres),
    band: distanceBand(distanceFromYouMetres),
    // intentionally no latitude / longitude
    privacy: "Distance only — exact location is not shared with proximity recipients.",
  };
}
