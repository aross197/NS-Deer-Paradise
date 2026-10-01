# Land 3D — 360° north-oriented terrain

**Route:** `/land-3d`

## Inspiration

Land 3D is inspired by **[Terraview](https://glargod.github.io/terraview/)** by **Glargod** ([repo](https://github.com/Glargod/terraview)) — map on top, live elevation mesh, AWS Terrarium DEM, and terrain-only “pin likely beds” (south-facing mid-slopes).

BuckTracks adapts that idea into the hunting app: GPS, **true north** orientation, NS presets, Nominatim search, bed pins, and satellite/topo basemaps.

## Features

| Feature | Detail |
|---------|--------|
| Elevation | AWS Terrarium DEM (~30–12 m) |
| Imagery | Esri satellite / topo / streets + OpenTopoMap |
| Orientation | Bearing 0° = true north |
| GPS | Fly to your location |
| Search | OpenStreetMap Nominatim |
| Presets | Heather Beach, Amherst, Cape Chignecto, Springhill Jct, Truro, Cabot Trail |
| Pin likely beds | Southish mid-slope scoring (terrain-only; not cover/food/pressure) |
| Relief | 1×–2.5× exaggeration |

## Stack

- MapLibre GL JS
- `lib/dem.ts` — DEM sample + bedding score (Terraview-style heuristics)
- `components/Land3DViewer.tsx`

```bash
npm install && npm run dev
# open /land-3d
```
