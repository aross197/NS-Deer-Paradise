# I Am Lost — Safety Feature

## What it does

When a hunter is disoriented in the woods they open **Safety → I Am Lost** and press the big red button.

1. **GPS fix** — high-accuracy browser geolocation
2. **Back bearing** — direction (true north degrees + compass label) from current position **toward** the marked home base (truck, road, camp)
3. **Distance** to home base
4. **Maps link** — one-tap open in Google Maps
5. **Waypoint list** — all saved stands, cams, parking, etc.
6. **Email** — sent to every emergency contact so someone can radio/phone them home

## Back bearing

- Computed as the forward bearing **from current location to home base**
- That is the heading the hunter should walk to return toward the truck/road
- Formula: spherical forward azimuth (`lib/geo.ts`)
- Displayed as e.g. `247.3° WSW`
- Note shown to user: true north; apply local magnetic declination if using a magnetic compass (NS often ~17° W — verify regionally)

## Data model

- `EmergencyContact` — name, email, optional phone, primary flag
- `Waypoint.isHomeBase` — mark truck/road/camp as the return target
- `LostAlert` — stored record of every activation (coords, bearing, distance, waypoints snapshot, who was emailed)

## Email content (planned)

```
Subject: [NS Deer Paradise] LOST ALERT — {Hunter Name}

{Name} activated I Am Lost at {time}.

Location: {lat}, {lon}
Maps: {google maps link}
GPS accuracy: ±{m} m

BACK BEARING TO HOME ({home name}):
  {bearing}° {compass} — about {distance} away
  Tell them to walk this heading toward the truck/road if terrain allows.

Waypoints on file:
  - Stand Ridge: …
  - Cam 3: …

Message from hunter: {optional}

This is an automated safety alert from NS Deer Paradise.
```

## Setup checklist for hunters

1. Add emergency contacts (email required)
2. Mark one waypoint as **home base**
3. Save other waypoints as usual
4. Test GPS permission once before season

## Limits

- Not a substitute for 911, PLB, or Search & Rescue
- Needs cell data or Wi‑Fi to send the email (consider offline SMS later)
- GPS accuracy varies under dense canopy — move to a clearing if possible

## Files

- `app/safety/page.tsx` — UI
- `app/api/safety/lost-alert/route.ts` — API
- `lib/geo.ts` — bearings & distance
- Prisma: `EmergencyContact`, `LostAlert`, `Waypoint.isHomeBase`
