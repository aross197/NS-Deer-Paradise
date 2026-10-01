# 🦌 NS Deer Paradise

**Every deer hunter's dream website — built for Northern Nova Scotia and beyond.**

Register for a free account → get a confirmation email → log into paradise.

**Repo:** https://github.com/aross197/NS-Deer-Paradise

## Vision

This is the all-in-one platform for white-tailed deer hunters in Nova Scotia (especially the north). No more jumping between apps, PDFs, Facebook groups, and weather sites. One place that does **everything**.

### Cool Core Features

- **Mass Dump Trail Cam Photo Reader (Accurate)**  
  Dump an entire SD card. We extract real EXIF timestamps, run high-quality animal detection (MegaDetector-class), auto-filter empty frames, tag deer / bucks / does with confidence scores, and give you a clean filterable gallery. Human overrides always win. See [`/cams`](app/cams/page.tsx) and [docs/TRAIL_CAM_ACCURATE_READER.md](docs/TRAIL_CAM_ACCURATE_READER.md).

- **Free Account + Email Confirmation**  
  Secure registration → confirmation email → logged into paradise.

- **Nova Scotia Deer Season Hub**  
  Live 2026–2027 dates, zones 101–112, antlerless draws, bag limits, youth & Sunday rules.

- **Interactive Maps**  
  Official NS Crown land open data, waypoints, stands, cam pins.

- **Hunt Journal, Weather + Solunar, Community, Gear, Venison Kitchen, Trophy Room**

## Tech Stack

- Next.js 15 + TypeScript + Tailwind
- Auth.js + Prisma + PostgreSQL
- Resend for email
- Leaflet + NS Crown Land layers
- Open-Meteo / MSC / solunar / sunrisesunset for weather & celestial data
- Trail cam pipeline designed around MegaDetector-class accuracy

## Docs

- [TRAIL_CAM_ACCURATE_READER.md](docs/TRAIL_CAM_ACCURATE_READER.md) — mass dump + accurate detection architecture
- [AUTH_AND_EMAIL.md](docs/AUTH_AND_EMAIL.md)
- [APIS_AND_DATA_SOURCES.md](docs/APIS_AND_DATA_SOURCES.md)

## Getting Started

```bash
git clone https://github.com/aross197/NS-Deer-Paradise.git
cd NS-Deer-Paradise
npm install
cp .env.example .env.local
npx prisma generate && npx prisma db push
npm run dev
```

## Roadmap Status

1. ✅ Repo + landing / register / login / dashboard
2. ✅ 2026–2027 NS deer season data
3. ✅ Free APIs & Crown land research
4. ✅ **Mass Dump Trail Cam Reader** (UI + schema + accuracy design)
5. ⏳ Real Auth.js + email confirmation
6. Wire actual detection worker (MegaDetector / vision pipeline)
7. Hunt journal, maps, weather widgets, polish

## Legal & Safety

Always follow current Nova Scotia DNR regulations. This is a helper tool, not a substitute for the official summary or hunter education. Hunt safe, hunt ethical.

---

Built with ❤️ for the woods of northern Nova Scotia.  
See you in the stand.
