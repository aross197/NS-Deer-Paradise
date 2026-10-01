# APIs & Data Sources for NS Deer Paradise

Researched and ready to integrate. All focus on free / open tiers suitable for a free hunting platform aimed at northern Nova Scotia.

## 1. Weather (Hyper-local for NS)

| Provider | Auth | Free Tier | Best For | Endpoint / Notes |
|----------|------|-----------|----------|------------------|
| **Open-Meteo** | None | Non-commercial ~10k calls/day | Forecasts, hourly temp/wind/pressure, no key | `https://api.open-meteo.com/v1/forecast?latitude=45.6&longitude=-63.3&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,pressure_msl,precipitation&timezone=America/Halifax` |
| **MSC GeoMet (Environment Canada)** | None | Fully open | Official Canadian weather, alerts, radar | `https://api.weather.gc.ca/` (OGC API) + Datamart |
| **wxdb.ca** | None | Free | Historical Canadian station observations | GeoJSON stations + hourly/daily |
| OpenWeatherMap / WeatherAPI | Key | Generous free tiers | Fallback if needed | Standard commercial free tiers |

**Recommended primary:** Open-Meteo (zero friction) + MSC for official alerts.

## 2. Solunar, Moon Phase, Sunrise/Sunset

| Provider | Auth | Notes |
|----------|------|-------|
| **api.solunar.org** | None | Classic solunar tables: `https://api.solunar.org/solunar/{lat},{lon},{YYYYMMDD},{tz}` |
| **sunrisesunset.io** | None (attribution) | Sunrise, sunset, twilight, **moon phase, moonrise/set, illumination** – excellent |
| **sunrise-sunset.org** | None (attribution) | Similar solar + some lunar |
| Local calculation | — | Can compute moon phase client-side with libraries if preferred |

**Recommended:** sunrisesunset.io for sun + moon data + solunar.org for major/minor periods. Combine into a simple “Deer Activity Score” (weather + solunar + pressure change).

## 3. Maps & Nova Scotia Crown Land (Critical for Hunters)

### Official NS Open Data
- **Crown Land dataset**: https://data.novascotia.ca/Lands-Forests-and-Wildlife/Crown-Land/3nka-59nz  
  - GeoJSON, Shapefile, KML, CSV exports  
  - ArcGIS MapServer: `https://nsgiwa.novascotia.ca/arcgis/rest/services/PLAN/PLANCrownLandsWM84V1/MapServer`
- **Provincial Landscape Viewer**: https://novascotia.ca/natr/landscape/ (forests, wetlands, wildlife, Crown, protected areas)
- GeoNova download services for additional layers

### Mapping Libraries / Base Maps
- **Leaflet** + OpenStreetMap tiles (already in package.json via react-leaflet)
- Mapbox GL (optional paid tier for nicer style)
- Overlay Crown Land GeoJSON or WMS tiles
- Add user waypoints, stands, trail cams on top

**Hunting tip layer ideas:** Crown vs private, protected areas (no-hunt), WMU / Deer Management Zones 101–112, access points.

## 4. Other Useful Free Sources

- **NS Hunting Regulations**: Official PDF + web pages (already linked in `lib/seasons.ts`)
- **Antlerless draw / licence info**: novascotia.ca/natr/hunt/
- **OpenStreetMap** for roads, trails, water features via Overpass API
- **iHunter / onX / HuntStand** – commercial inspiration only (do not scrape)

## 5. Suggested Integration Order

1. **Weather widget** on Dashboard using Open-Meteo (lat/lon for northern NS default, e.g. around 45.6, -63.3 or user location).
2. **Solunar + moon** card next to weather.
3. **Maps page** with Leaflet + Crown Land overlay + user waypoints.
4. Simple client-side or server-side “activity score” that combines pressure trend, wind, solunar major periods, and moon illumination.

## 6. Environment Variables to Add

```env
# Optional – most recommended APIs need none
NEXT_PUBLIC_DEFAULT_LAT=45.6
NEXT_PUBLIC_DEFAULT_LON=-63.3
# Mapbox if you want premium tiles later
NEXT_PUBLIC_MAPBOX_TOKEN=
```

## Attribution Requirements

- Open-Meteo → CC BY 4.0
- sunrisesunset.io / sunrise-sunset.org → visible link back
- NS Open Data → Nova Scotia Open Government Licence
- Always credit official DNR for regulations

---

These sources turn NS Deer Paradise from a nice shell into a genuinely useful daily tool for northern Nova Scotia hunters. Next implementation targets: weather + solunar components and a basic maps page with Crown land.
