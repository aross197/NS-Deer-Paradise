# Mass Dump Trail Cam Photo Reader — Accurate by Design

## Goal

Hunters dump an entire SD card (hundreds or thousands of photos). The system:

1. Ingests the batch quickly
2. Extracts accurate EXIF (timestamp, camera, GPS if present)
3. Runs high-quality animal detection
4. Filters empty frames
5. Tags deer / bucks / does with confidence
6. Gives a clean, filterable gallery so you only look at what matters

## Accuracy Foundation

We do **not** invent magical AI claims. We build on the best open tools used by real camera-trap researchers:

### Primary Detection: MegaDetector family
- Microsoft AI for Good / CameraTraps project
- Locates animals, people, and vehicles in camera-trap images with strong recall
- Designed exactly for the empty-frame problem that wastes hunters’ time
- Open source (MIT / Apache variants available)
- Used in 80+ conservation programs worldwide

### Supporting tools & ideas
- **AddaxAI** — free desktop app built around MegaDetector + species models (great reference for UX)
- **EXIF extraction** first — timestamps are sacred for weather correlation and timelines
- Human override always wins — every AI tag can be corrected

## Pipeline (implemented / planned)

```
User selects folder / drops files
        ↓
Create TrailCamJob (status: uploading)
        ↓
Upload files → store originals + generate thumbnails
        ↓
Extract EXIF (takenAt, make/model, lat/lon)  ← client or server
        ↓
Queue for analysis (status: analyzing)
        ↓
Run detector (MegaDetector-class or hosted equivalent)
  - hasAnimal / hasPerson / hasVehicle / isEmpty
  - confidence score
        ↓
Optional species / deer / buck head classifier
        ↓
Write results to TrailCamPhoto records
        ↓
Job status: complete  → notify user + show filtered gallery
```

## Data Model (already in Prisma)

- `TrailCamJob` — one dump / one SD card
- `TrailCamPhoto` — every image with:
  - EXIF fields
  - detection flags + confidence
  - deer / buck / doe / antlerPoints
  - userTags + userNotes (override layer)

## Cool Features Enabled by Accuracy

- **Empty frame filter** — instantly hide the 70-90% blank shots
- **Deer only / Bucks only** filters
- Timeline by actual photo time (not upload time)
- Confidence badges so you know when to trust the tag
- Future: same-buck matching, activity heatmaps, journal linking

## Implementation Notes for Developers

1. **Client-side EXIF** can be done with `exifr` or `exif-js` while uploading for instant feedback.
2. **Heavy detection** should run server-side or on a worker (GPU preferred). Options:
   - Self-host MegaDetector / PyTorch-Wildlife
   - Use a vision LLM endpoint with careful prompting + verification
   - Queue jobs and process offline
3. Always store the original image. Never rely only on AI labels.
4. Show progress: “247 / 1,200 processed • 38 animals found • 19 deer”

## Why this is cooler for northern NS hunters

Most apps make you click through every night shot. This one respects your time: dump the card, get the animals, keep the bucks, ignore the empties — with real detection quality behind it.

---

See also: `app/cams/page.tsx` for the UI and `prisma/schema.prisma` for the models.
