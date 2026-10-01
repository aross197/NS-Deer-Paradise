# 🦌 NS Deer Paradise

**Every deer hunter's dream website — built for Northern Nova Scotia and beyond.**

Register for a free account → get a confirmation email → log into paradise.

## Vision

This is the all-in-one platform for white-tailed deer hunters in Nova Scotia (especially the north). No more jumping between apps, PDFs, Facebook groups, and weather sites. One place that does **everything**:

### Core Features (Planned & In Progress)

- **Free Account + Email Confirmation**  
  Secure registration, confirmation email, instant login to your personalized dashboard.

- **Nova Scotia Deer Season Hub**  
  Live 2026–2027 dates, zones (101–112), antlerless draws, bag limits, youth seasons, Sunday hunting rules, official links. Always up-to-date.

- **Interactive Maps**  
  Crown land, public access, private land notes, waypoints, stand locations, trail camera pins, scent cone / wind tools, offline-capable layers focused on NS.

- **Hunt Journal & Logbook**  
  Log every hunt: weather, moon phase, wind, sightings, harvests, photos, GPS tracks. Searchable history and stats.

- **Trail Camera Gallery**  
  Upload, tag, and organize cam pics. Share with trusted friends or keep private. AI-assisted buck ID (future).

- **Weather + Solunar + Activity Forecast**  
  Hyper-local northern NS weather, barometric pressure, solunar tables, and a simple “deer activity score” tailored to Maritime conditions.

- **Community & Club**  
  Private groups for your hunting buddies, public forums for tips, “who’s seeing what” reports (anonymized), gear swaps, and mentorship for youth hunters.

- **Gear & Checklist**  
  Season-ready packing lists, gear reviews from real NS hunters, licensing reminders, safety course links.

- **Venison Kitchen**  
  Recipes, butchering tips, freezer inventory tracker.

- **Trophy & Scoring**  
  Photo upload + basic scoring helper, personal trophy room.

- **Safety & Compliance**  
  Hunter education reminders, regulations snapshot, “am I legal today?” checker by zone and weapon.

## Tech Stack (Starting Point)

- **Frontend / Full-stack**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Auth**: Auth.js (NextAuth) with email magic link / confirmation flow
- **Database**: Prisma + PostgreSQL (ready for Supabase or Neon)
- **Email**: Resend (or similar transactional provider)
- **Maps**: Leaflet / Mapbox GL (NS-focused layers)
- **Storage**: S3-compatible for photos
- **Deployment**: Vercel (easy) or self-hosted

## Getting Started (Local Development)

```bash
git clone https://github.com/aross197/NS-Deer-Paradise.git
cd NS-Deer-Paradise
npm install
cp .env.example .env.local   # fill in secrets
npx prisma generate
npx prisma db push
npm run dev
```

Open http://localhost:3000

## Project Structure (Planned)

```
/
├── app/                  # Next.js App Router
│   ├── (auth)/           # login, register, confirm
│   ├── dashboard/        # logged-in paradise
│   ├── seasons/          # NS regulations & calendar
│   ├── maps/             # interactive hunting maps
│   ├── journal/          # hunt logs
│   ├── cams/             # trail camera gallery
│   ├── community/        # forums & groups
│   └── api/              # route handlers
├── components/
├── lib/                  # auth, db, email, maps helpers
├── prisma/               # schema
└── public/
```

## Roadmap

1. ✅ Repo + vision + basic structure
2. Auth system with email confirmation
3. User dashboard (“Paradise”)
4. NS Season data + calendar
5. Hunt journal MVP
6. Maps foundation
7. Community basics
8. Weather / solunar integration
9. Photo uploads & gallery
10. Polish, mobile PWA, offline support

## Contributing

This started as a passion project for northern Nova Scotia hunters and their friends. Pull requests, feature ideas, and real-world feedback are welcome. Keep it respectful, legal, and focused on ethical hunting.

## Legal & Safety

Always follow current Nova Scotia Department of Natural Resources regulations. This site is a helper tool — not a substitute for the official summary of regulations or your hunter education certificate. Hunt safe, hunt ethical, respect landowners and wildlife.

---

Built with ❤️ for the woods of northern Nova Scotia.  
See you in the stand.
