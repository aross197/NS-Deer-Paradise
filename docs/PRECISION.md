# Precision accuracy — BuckTracks

What “precision” means in each subsystem, and the hard limits of free data.

## GPS (device)

| Setting | Value |
|---------|--------|
| API | `enableHighAccuracy: true`, `maximumAge: 0` |
| Coords stored / shared | **7 decimal places** (~1.1 cm nominal) |
| Reality | Phone GPS under canopy often **±3–15 m**; open sky better |
| UI | Accuracy circle drawn when `coords.accuracy` is known |

Always treat the **± accuracy ring** as the true footprint, not the pin alone.

## Bearings & distance (SOS)

| Item | Method |
|------|--------|
| Distance | **Vincenty inverse on WGS84** (ellipsoid), not flat-plane |
| Bearing | Vincenty forward azimuth, **true north** |
| Display | 1 decimal degree + compass octant |
| Magnetic | NS declination ~**17° E** helper in `lib/geo.ts` for compass users |

Typical woods distances (under a few km): sub-metre distance error from the model; **GPS fix error dominates**.

## Terrain / Land 3D

| Layer | Source | Approx. resolution |
|-------|--------|---------------------|
| Elevation | AWS Terrarium DEM | ~**30–12 m** grid |
| Standing ring | Exact **200.0 m** geodesic-ish circle from lat/lon math |
| Satellite | Esri World Imagery | Varies; not real-time |

DEM is excellent for **ridge / slope shape**; it is **not** centimetre survey grade. Bed pins are terrain-only guesses.

## Weather

| Item | Detail |
|------|--------|
| Source | Open-Meteo (ECMWF / regional models) |
| Query | Exact lat/lon (6–7 dp) |
| Grid | Model cell is kilometres-scale — microclimate in a hollow can differ |

## Trail cam AI

| Item | Detail |
|------|--------|
| Engine | TensorFlow.js COCO-SSD |
| Strength | Real detections; empty / person / vehicle triage |
| Limit | Not MegaDetector; deer = **hint**, not species lab ID |

## Honesty rule

**Precision math** (Vincenty, 7 dp coords) does not beat **sensor noise** (GPS under spruce). BuckTracks shows uncertainty (accuracy rings, notes) so you can hunt and navigate with eyes open.
