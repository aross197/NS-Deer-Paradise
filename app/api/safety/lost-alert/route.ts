import { NextRequest, NextResponse } from "next/server";
import {
  backBearing,
  formatBearing,
  formatDistance,
  distanceMetres,
  mapsLink,
} from "@/lib/geo";
import {
  PROXIMITY_RADIUS_KM,
  proximityAlertPayload,
  toPublicNearby,
} from "@/lib/proximity";

/**
 * POST /api/safety/lost-alert
 *
 * Body:
 * {
 *   latitude, longitude, accuracyMetres?,
 *   notifySelected?: boolean,
 *   notifyProximity?: boolean,
 *   contactIds?: string[],
 *   message?:
 * }
 *
 * Selected contacts → full location + bearing + waypoints.
 * Proximity (opted-in, ≤25 km) → distance only, no exact coords.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      latitude,
      longitude,
      accuracyMetres,
      message,
      notifySelected = true,
      notifyProximity = true,
      contactIds = [],
    } = body;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return NextResponse.json(
        { error: "Valid latitude and longitude required" },
        { status: 400 }
      );
    }

    if (!notifySelected && !notifyProximity) {
      return NextResponse.json(
        { error: "Choose selected contacts and/or proximity notify" },
        { status: 400 }
      );
    }

    // TODO: session auth
    const home = { lat: 45.62, lon: -63.28, name: "Home base (truck/road)" };
    const here = { lat: latitude, lon: longitude };

    const bearing = backBearing(here, home);
    const dist = distanceMetres(here, home);
    const mapsUrl = mapsLink(latitude, longitude);

    // --- Selected contacts: FULL location (email via Resend when wired) ---
    const selectedPayload = notifySelected
      ? {
          latitude,
          longitude,
          accuracyMetres: accuracyMetres ?? null,
          backBearingDeg: bearing,
          backBearingLabel: formatBearing(bearing),
          distanceToHomeM: dist,
          distanceLabel: formatDistance(dist),
          homeWaypointName: home.name,
          mapsUrl,
          message: message ?? null,
          contactIds,
        }
      : null;

    // --- Proximity: load opted-in presences server-side, never return their coords ---
    // TODO: prisma userPresence where proximityOptIn && updated recently
    const presenceCandidates: { displayName: string; lat: number; lon: number }[] =
      []; // filled from DB

    const nearbyPublic = notifyProximity
      ? toPublicNearby(here, presenceCandidates)
      : [];

    // Each nearby recipient gets distance-only payload (no lost-person lat/lon)
    const proximityNotices = nearbyPublic.map((n) => ({
      // recipientUserId: …
      notice: proximityAlertPayload(n.distanceMetres),
      // display for the lost hunter (already distance-only)
      publicRow: n,
    }));

    // TODO: email/push selected with selectedPayload
    // TODO: email/push proximity with notice only
    // TODO: prisma.lostAlert.create

    return NextResponse.json({
      ok: true,
      radiusKm: PROXIMITY_RADIUS_KM,
      selected: selectedPayload
        ? { sent: true, note: "Full location to selected contacts" }
        : { sent: false },
      proximity: {
        sent: notifyProximity,
        count: proximityNotices.length,
        // Safe to show lost hunter: distances only
        nearby: nearbyPublic,
        privacy:
          "Proximity recipients receive distance only — exact location not included.",
      },
      note: "Auth, Resend, and presence DB pending wiring",
    });
  } catch (e) {
    console.error("lost-alert error", e);
    return NextResponse.json({ error: "Failed to process lost alert" }, { status: 500 });
  }
}
