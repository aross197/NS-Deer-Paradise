import { NextRequest, NextResponse } from "next/server";
import {
  backBearing,
  formatBearing,
  formatDistance,
  distanceMetres,
  mapsLink,
} from "@/lib/geo";
import { PROXIMITY_RADIUS_KM, toPublicNearby } from "@/lib/proximity";

export const dynamic = "force-dynamic";

/**
 * POST /api/safety/lost-alert
 * Processes a real GPS alert: computes bearing, distance, maps link.
 * Email/push require RESEND_API_KEY + contacts in body; otherwise returns
 * a complete alert payload the client can share via mailto: / SMS.
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
      notifyProximity = false,
      contacts = [] as { name: string; email: string }[],
      homeLat,
      homeLon,
      homeName = "Home base",
      presence = [] as { displayName: string; lat: number; lon: number }[],
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

    const home = {
      lat: typeof homeLat === "number" ? homeLat : 45.62,
      lon: typeof homeLon === "number" ? homeLon : -63.28,
      name: homeName,
    };
    const here = { lat: latitude, lon: longitude };
    const bearing = backBearing(here, home);
    const dist = distanceMetres(here, home);
    const mapsUrl = mapsLink(latitude, longitude);
    const backBearingLabel = formatBearing(bearing);

    const alertId = `alert_${Date.now()}`;

    const fullAlert = {
      id: alertId,
      latitude,
      longitude,
      accuracyMetres: accuracyMetres ?? null,
      backBearingDeg: bearing,
      backBearingLabel,
      distanceToHomeM: dist,
      distanceLabel: formatDistance(dist),
      homeWaypointName: home.name,
      mapsUrl,
      message: message ?? null,
      createdAt: new Date().toISOString(),
    };

    const mailtoLinks: string[] = [];
    if (notifySelected && Array.isArray(contacts)) {
      for (const c of contacts) {
        if (!c?.email) continue;
        const subject = encodeURIComponent(
          `[BuckTracks SOS] I Am Lost — ${backBearingLabel}`
        );
        const bodyText = encodeURIComponent(
          [
            "BuckTracks SOS alert",
            "",
            `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            `Maps: ${mapsUrl}`,
            accuracyMetres != null
              ? `GPS accuracy: ±${Math.round(accuracyMetres)} m`
              : "",
            "",
            `BACK BEARING TO ${home.name}: ${backBearingLabel}`,
            `Distance: ${formatDistance(dist)}`,
            "",
            message ? `Message: ${message}` : "",
            "",
            "Selected contacts receive full location. Proximity network receives distance only.",
          ]
            .filter(Boolean)
            .join("\n")
        );
        mailtoLinks.push(`mailto:${c.email}?subject=${subject}&body=${bodyText}`);
      }
    }

    const nearby =
      notifyProximity && Array.isArray(presence)
        ? toPublicNearby(here, presence)
        : [];

    // Resend email when key is present
    let emailsAttempted = 0;
    let emailsSent = 0;
    if (process.env.RESEND_API_KEY && notifySelected) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from =
          process.env.EMAIL_FROM ?? "BuckTracks <onboarding@resend.dev>";
        for (const c of contacts) {
          if (!c?.email) continue;
          emailsAttempted++;
          await resend.emails.send({
            from,
            to: c.email,
            subject: `[BuckTracks SOS] I Am Lost — ${backBearingLabel}`,
            text: [
              `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              `Maps: ${mapsUrl}`,
              `Back bearing to ${home.name}: ${backBearingLabel}`,
              `Distance: ${formatDistance(dist)}`,
              message ?? "",
            ].join("\n"),
          });
          emailsSent++;
        }
      } catch (err) {
        console.error("Resend failed", err);
      }
    }

    return NextResponse.json({
      ok: true,
      alert: fullAlert,
      radiusKm: PROXIMITY_RADIUS_KM,
      mailtoLinks,
      nearby,
      email: {
        attempted: emailsAttempted,
        sent: emailsSent,
        resendConfigured: Boolean(process.env.RESEND_API_KEY),
      },
      privacy:
        "Selected contacts: full location. Proximity: distance only when presence provided.",
    });
  } catch (e) {
    console.error("lost-alert error", e);
    return NextResponse.json(
      { error: "Failed to process lost alert" },
      { status: 500 }
    );
  }
}
