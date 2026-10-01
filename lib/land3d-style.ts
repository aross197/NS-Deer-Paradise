import type { StyleSpecification } from "maplibre-gl";

/**
 * High-quality 3D land style — no API key required.
 * Imagery: Esri World Imagery (satellite)
 * Elevation: AWS Open Data Terrarium DEM (global, accurate enough for hunting terrain)
 * Sky + fog for cinematic depth
 */
export function buildLand3dStyle(exaggeration = 1.35): StyleSpecification {
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
          "raster-saturation": 0.05,
          "raster-contrast": 0.1,
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
          "hillshade-exaggeration": 0.55,
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
      "sky-color": "#87b5d4",
      "sky-horizon-blend": 0.08,
      "horizon-color": "#c9d9e8",
      "horizon-fog-blend": 0.7,
      "fog-color": "#a8b8c4",
      "fog-ground-blend": 0.35,
    },
  };
}

/** Default view when GPS not yet available — northern Nova Scotia (Truro area) */
export const NS_LAND_DEFAULT = {
  lat: 45.3647,
  lon: -63.2797,
  zoom: 13.5,
  pitch: 68,
  bearing: 0, // true north
};
