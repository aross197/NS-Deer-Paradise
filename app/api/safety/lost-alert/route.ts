import { NextRequest, NextResponse } from "next/server";
import {
  backBearing,
  formatBearing,
  formatDistance,
  distanceMetres,
  mapsLink,
} from "@/lib/geo";

/**
 * POST /api/safety/lost-alert
 *
 * Body:
 * {
 *   latitude, longitude, accuracyMetres?,
 *   message?,
 *   // when auth is live, userId comes from session
 * }
 *
 * Loads user's home-base waypoint + all waypoints + emergency contacts,
 * computes back bearing, emails contacts via Resend, stores LostAlert.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { latitude, longitude, accuracyMetres, message } = body;

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

    // TODO: require session — const session = await auth();
    // TODO: load user waypoints where isHomeBase === true
    // TODO: load EmergencyContact emails

    // Placeholder home until DB is wired (northern NS example)
    const home = { lat: 45.62, lon: -63.28, name: "Home base (truck/road)" };
    const here = { lat: latitude, lon: longitude };

    const bearing = backBearing(here, home);
    const dist = distanceMetres(here, home);
    const mapsUrl = mapsLink(latitude, longitude);

    const alertPayload = {
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
      // waypointsJson: JSON.stringify(userWaypoints),
      // emailsSentTo: contactEmails,
    };

    // TODO: await resend.emails.send({ ... }) to each emergency contact
    // Subject: "[NS Deer Paradise] LOST ALERT — {user name}"
    // Body: location, maps link, back bearing to walk home, distance, waypoint list

    // TODO: prisma.lostAlert.create({ data: ... })

    return NextResponse.json({
      ok: true,
      alert: alertPayload,
      note: "Email + DB persistence pending Auth.js and Resend wiring",
    });
  } catch (e) {
    console.error("lost-alert error", e);
    return NextResponse.json({ error: "Failed to process lost alert" }, { status: 500 });
  }
}
