# Proximity SOS (25 km)

When **I Am Lost / SOS** fires, the hunter chooses:

1. **Selected people** (emergency contacts / crew) — get **full** location, back bearing, waypoints, maps link.
2. **Anyone within 25 km** who has opted into the proximity safety network — get a **distance-only** alert.

Both can be on at once.

## Privacy rules

| Audience | What they see |
|----------|----------------|
| Selected contacts | Exact coords, maps link, back bearing, waypoints |
| Proximity recipients (≤25 km, opted in) | “Hunter lost ~X km from you” — **no** lat/lon of the lost person |
| Lost hunter UI “Nearby” list | Other hunters’ **distance / band only** — **no** their coordinates |

Server never returns other users’ lat/lon to the client in proximity payloads.

## Opt-in

Hunters must enable “Help nearby SOS” and periodically refresh a coarse presence (or last known when the app was open). Presence is only used for emergency matching; it is not a live public map of hunters.

## Implementation

- Radius: `PROXIMITY_RADIUS_KM = 25` in `lib/proximity.ts`
- `toPublicNearby()` strips coordinates
- `proximityAlertPayload()` for push/email to nearby users
- UI: `/sos` checkboxes + nearby list

## Schema (planned fields)

- `User.proximityOptIn` Boolean
- `UserPresence` — userId, lat, lon, updatedAt (server-only for distance calc)
- `LostAlert.notifyProximity` Boolean
- `LostAlert.notifyContactIds` String[]
- `LostAlertProximityNotify` — alertId, recipientUserId, distanceMetres (audit, no response coords stored publicly)
