import type { StyleSpecification } from "maplibre-gl";

/**
 * High-quality 3D land style — no API key required.
 * Imagery: Esri World Imagery (satellite)
 * Elevation: AWS Open Data Terrarium DEM
 *
 * Default camera targets ~200 m around you (standing-scale view).
 */
export function buildLand3dStyle(exaggeration = 1.2): StyleSpecification {
  return {
    version: 8,
    name: "BuckTracks Land 3D",
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      satellite: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution:
          "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        maxzoom: 19,
      },
      terrarium: {
        type: "raster-dem",
        tiles: [
          "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
        ],
        encoding: "terrarium",
        tileSize: 256,
        maxzoom: 15,
        attribution: "Elevation © AWS Open Data / Terrain Tiles",
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#0a1210",
        },
      },
      {
        id: "satellite",
        type: "raster",
        source: "satellite",
        paint: {
          "raster-opacity": 1,
          "raster-saturation": 0.08,
          "raster-contrast": 0.12,
          "raster-brightness-min": 0.02,
        },
      },
      {
        id: "hillshade",
        type: "hillshade",
        source: "terrarium",
        paint: {
          "hillshade-shadow-color": "#1a1208",
          "hillshade-highlight-color": "#fff8e7",
          "hillshade-accent-color": "#3d2a14",
          "hillshade-exaggeration": 0.45,
          "hillshade-illumination-direction": 315,
          "hillshade-illumination-anchor": "viewport",
        },
      },
    ],
    terrain: {
      source: "terrarium",
      exaggeration,
    },
    sky: {
      "sky-color": "#7eb0d0",
      "sky-horizon-blend": 0.06,
      "horizon-color": "#d0dde8",
      "horizon-fog-blend": 0.55,
      "fog-color": "#b8c6d0",
      // Closer fog for ~200 m standing-scale view
      "fog-ground-blend": 0.55,
    },
  };
}

/**
 * Standing-scale defaults: ~200 m radius around the hunter.
 * Zoom ~16.85 ≈ 350–450 m across viewport at mid-latitudes → ~200 m each way.
 * High pitch ≈ looking out over the ground, not a high aerial orbit.
 */
export const STANDING_VIEW = {
  radiusMetres: 200,
  zoom: 16.85,
  pitch: 78,
  bearing: 0,
  exaggeration: 1.2,
} as const;

export const NS_LAND_DEFAULT = {
  lat: 45.3647,
  lon: -63.2797,
  zoom: STANDING_VIEW.zoom,
  pitch: STANDING_VIEW.pitch,
  bearing: STANDING_VIEW.bearing,
};

/** GeoJSON ring ~radiusMetres around lon/lat (for the 200 m guide circle) */
export function circlePolygon(
  lon: number,
  lat: number,
  radiusMetres: number,
  steps = 64
): GeoJSON.Feature<GeoJSON.Polygon> {
  const coords: [number, number][] = [];
  const mLat = 111132.92 - 559.82 * Math.cos((2 * lat * Math.PI) / 180);
  const mLng = 111412.84 * Math.cos((lat * Math.PI) / 180);
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const dLat = (radiusMetres * Math.cos(a)) / mLat;
    const dLng = (radiusMetres * Math.sin(a)) / mLng;
    coords.push([lon + dLng, lat + dLat]);
  }
  return {
    type: "Feature",
    properties: { radiusMetres },
    geometry: { type: "Polygon", coordinates: [coords] },
  };
}
