# 🦌 NS Deer Paradise

**Every deer hunter's dream website — built for Northern Nova Scotia and beyond.**

Register for a free account → get a confirmation email → log into paradise.

**Repo:** https://github.com/aross197/NS-Deer-Paradise

## Vision

This is the all-in-one platform for white-tailed deer hunters in Nova Scotia (especially the north). No more jumping between apps, PDFs, Facebook groups, and weather sites. One place that does **everything**.

### Core Features (Planned & In Progress)

- **Free Account + Email Confirmation**  
  Secure registration, confirmation email, instant login to your personalized dashboard.

- **Nova Scotia Deer Season Hub**  
  Live 2026–2027 dates, zones (101–112), antlerless draws, bag limits, youth seasons, Sunday hunting rules, official links.

- **Interactive Maps**  
  Crown land (official NS open data), public access, waypoints, stand locations, trail camera pins, wind tools.

- **Hunt Journal & Logbook**  
  Log every hunt: weather, moon phase, wind, sightings, harvests, photos, GPS tracks.

- **Trail Camera Gallery**  
  Upload, tag, and organize cam pics. Share with trusted friends or keep private.

- **Weather + Solunar + Activity Forecast**  
  Hyper-local northern NS weather (Open-Meteo + MSC), barometric pressure, solunar tables, simple deer activity score.

- **Community & Club**  
  Private groups for your hunting buddies, tips, gear swaps, mentorship for youth hunters.

- **Gear, Venison Kitchen, Trophy Room, Safety Checker**

## Tech Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Auth.js + Prisma + PostgreSQL
- Resend for transactional email
- Leaflet / react-leaflet + NS Crown Land GeoJSON / ArcGIS layers
- Open-Meteo, solunar.org, sunrisesunset.io for weather & celestial data

## Docs

- [AUTH_AND_EMAIL.md](docs/AUTH_AND_EMAIL.md) — registration + confirmation flow
- [APIS_AND_DATA_SOURCES.md](docs/APIS_AND_DATA_SOURCES.md) — free weather, solunar, moon, Crown land, and mapping sources researched for this project

## Getting Started

```bash
git clone https://github.com/aross197/NS-Deer-Paradise.git
cd NS-Deer-Paradise
npm install
cp .env.example .env.local
npx prisma generate && npx prisma db push
npm run dev
```

## Current Roadmap Status

1. ✅ Repo + vision + basic structure + landing / register / login / dashboard
2. ✅ 2026–2027 NS deer season data + helpers
3. ✅ Research of free APIs & official NS Crown land open data
4. ⏳ Auth system with real email confirmation (next priority)
5. Hunt journal MVP
6. Weather + solunar components
7. Maps with Crown land overlay
8. Photo uploads, community, polish, PWA

## Legal & Safety

Always follow current Nova Scotia Department of Natural Resources regulations. This site is a helper tool — not a substitute for the official summary or your hunter education certificate. Hunt safe, hunt ethical, respect landowners and wildlife.

---

Built with ❤️ for the woods of northern Nova Scotia.  
See you in the stand.
