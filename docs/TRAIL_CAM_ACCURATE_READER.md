# Trail Cam AI — Mass Dump Reader

## What runs today (real, on-device)

| Step | Implementation |
|------|----------------|
| Mass upload | Multi-file select + drag/drop |
| EXIF | `exifr` — DateTimeOriginal, camera make/model, GPS |
| Detection | **TensorFlow.js + COCO-SSD** (lite MobileNet v2) |
| Categories | MegaDetector-style: **animal / person / vehicle / empty** |
| Filters | All, non-empty, animals, deer hint, empty, people |
| Privacy | Images stay in the browser (object URLs) |

## Pipeline

1. User dumps photos from SD card
2. Model loads once (`loadDetector()`)
3. Each image: EXIF parse + `model.detect()`
4. Scores ≥ 0.35 mapped to MD classes
5. Empty = no animal/person/vehicle
6. “Deer hint” = large-mammal COCO classes or strong animal score (not pure species ID)

## Accuracy notes

- **COCO-SSD** is a real neural net, good for people, vehicles, and many animals.
- It is **not** Microsoft MegaDetector. IR night cams and pure whitetail species ID are harder.
- Research-grade path: run [PytorchWildlife MegaDetector V6](https://microsoft.github.io/MegaDetector/) as a local/GPU service and point the app at it later.

## Code

- `lib/trailcam-ai.ts` — engine
- `app/cams/page.tsx` — UI
- Dependencies: `@tensorflow/tfjs`, `@tensorflow-models/coco-ssd`, `exifr`

```bash
npm install
npm run dev
# open /cams and select photos
```
