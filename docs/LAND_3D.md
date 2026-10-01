# Land 3D — 360° north-oriented terrain

**Route:** `/land-3d`

## What you get

- **Your GPS** (or default northern NS until located)
- **True north** orientation (bearing `0°`) on load and via “Orient north”
- **360° look-around** — drag / orbit the camera around your pin
- **Real elevation** — AWS Terrarium global DEM (not a flat map)
- **Satellite drape** — Esri World Imagery (Maxar / Earthstar class imagery)
- **Hillshade + sky/fog** for depth
- **Relief slider** — exaggerate terrain 1×–2.5× to read ridges

## Stack

- [MapLibre GL JS](https://maplibre.org/) (open source, WebGL)
- DEM: `s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`
- Imagery: Esri World Imagery tiles

## Files

- `components/Land3DViewer.tsx`
- `lib/land3d-style.ts`
- `app/land-3d/page.tsx`

```bash
npm install
npm run dev
# open /land-3d → Use my location
```

## Accuracy notes

- DEM is survey-grade global tiles suitable for reading hills, valleys, and approaches; not a surveyed stand plot.
- Satellite lag and tree canopy mean you still verify on the ground.
- Compass shows map bearing (true north reference), not magnetic north — apply local declination if matching a magnetic compass.
