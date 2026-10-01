/**
 * AWS Terrarium DEM helpers + terrain-only bedding heuristics.
 * Inspired by Terraview (Glargod) — https://glargod.github.io/terraview/
 * MIT-licensed approach: sample Terrarium tiles, score southish mid-slopes.
 */

const DEM_URL =
  "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";
const DEM_MAX_Z = 15;

const tileCache = new Map<
  string,
  { size: number; data: Uint8ClampedArray }
>();

export function terrariumHeight(r: number, g: number, b: number): number {
  return r * 256 + g + b / 256 - 32768;
}

export function lngLatToWorld(lng: number, lat: number, z: number) {
  const n = 2 ** z;
  const x = ((lng + 180) / 360) * n;
  const s = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n;
  return { x, y };
}

function demUrl(z: number, x: number, y: number) {
  return DEM_URL.replace("{z}", String(z))
    .replace("{x}", String(x))
    .replace("{y}", String(y));
}

export async function loadDemTile(z: number, x: number, y: number) {
  const key = `${z}/${x}/${y}`;
  if (tileCache.has(key)) return tileCache.get(key)!;
  const img = new Image();
  img.crossOrigin = "anonymous";
  const tile = await new Promise<{ size: number; data: Uint8ClampedArray }>(
    (resolve, reject) => {
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, c.width, c.height).data;
        const t = { size: img.width, data };
        tileCache.set(key, t);
        resolve(t);
      };
      img.onerror = () => reject(new Error("DEM tile " + key));
      img.src = demUrl(z, x, y);
    }
  );
  return tile;
}

export function metersPerDegree(lat: number) {
  return {
    mLat: 111132.92 - 559.82 * Math.cos((2 * lat * Math.PI) / 180),
    mLng: 111412.84 * Math.cos((lat * Math.PI) / 180),
  };
}

export interface HeightGrid {
  heights: Float32Array;
  min: number;
  max: number;
  west: number;
  east: number;
  south: number;
  north: number;
  cols: number;
  rows: number;
}

export async function buildHeightGrid(
  bounds: { west: number; east: number; south: number; north: number },
  cols: number,
  rows: number,
  z: number
): Promise<HeightGrid> {
  const { west, east, south, north } = bounds;
  const heights = new Float32Array(cols * rows);
  const needed = new Set<string>();
  const coords: {
    lng: number;
    lat: number;
    tx: number;
    ty: number;
    fx: number;
    fy: number;
  }[] = [];

  for (let j = 0; j < rows; j++) {
    const lat = north - ((north - south) * j) / (rows - 1);
    for (let i = 0; i < cols; i++) {
      const lng = west + ((east - west) * i) / (cols - 1);
      const w = lngLatToWorld(lng, lat, z);
      const tx = Math.floor(w.x);
      const ty = Math.floor(w.y);
      needed.add(`${tx}/${ty}`);
      coords.push({ lng, lat, tx, ty, fx: w.x - tx, fy: w.y - ty });
    }
  }

  const tiles: Record<string, { size: number; data: Uint8ClampedArray }> = {};
  await Promise.all(
    [...needed].map(async (k) => {
      const [tx, ty] = k.split("/").map(Number);
      tiles[k] = await loadDemTile(z, tx, ty);
    })
  );

  let min = Infinity;
  let max = -Infinity;
  coords.forEach((c, idx) => {
    const tile = tiles[`${c.tx}/${c.ty}`];
    const px = Math.min(tile.size - 1, Math.max(0, Math.floor(c.fx * tile.size)));
    const py = Math.min(tile.size - 1, Math.max(0, Math.floor(c.fy * tile.size)));
    const i = (py * tile.size + px) * 4;
    const h = terrariumHeight(tile.data[i], tile.data[i + 1], tile.data[i + 2]);
    heights[idx] = h;
    if (h < min) min = h;
    if (h > max) max = h;
  });

  return { heights, min, max, west, east, south, north, cols, rows };
}

function aspectDeg(dzdx: number, dzdy: number) {
  let a = (Math.atan2(dzdy, -dzdx) * 180) / Math.PI;
  if (a < 0) a += 360;
  return a;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function haversineM(lng1: number, lat1: number, lng2: number, lat2: number) {
  const R = 6371000;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = p2 - p1;
  const dl = ((lng2 - lng1) * Math.PI) / 180;
  const s =
    Math.sin(dp / 2) ** 2 +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export interface BedCandidate {
  lng: number;
  lat: number;
  score: number;
  slope: number;
  aspect: number;
  elev: number;
  why: string;
}

/** Terrain-only: prefer southish mid-slopes (3–30°). Not cover/food/pressure. */
export function scoreBedding(grid: HeightGrid): BedCandidate[] {
  const { cols, rows, heights, west, east, south, north } = grid;
  const midLat = (north + south) / 2;
  const { mLat, mLng } = metersPerDegree(midLat);
  const cellM = Math.max(
    ((east - west) / Math.max(1, cols - 1)) * mLng,
    ((north - south) / Math.max(1, rows - 1)) * mLat
  );
  const candidates: BedCandidate[] = [];

  for (let j = 2; j < rows - 2; j++) {
    for (let i = 2; i < cols - 2; i++) {
      const h = heights[j * cols + i];
      if (h < 3) continue;
      const dx = cellM * 2;
      const dzdx =
        (heights[j * cols + (i + 1)] - heights[j * cols + (i - 1)]) / dx;
      const dzdy =
        (heights[(j - 1) * cols + i] - heights[(j + 1) * cols + i]) / dx;
      const slope = (Math.atan(Math.hypot(dzdx, dzdy)) * 180) / Math.PI;
      if (slope < 3 || slope > 30) continue;
      const aspect = aspectDeg(dzdx, dzdy);
      let nMin = Infinity;
      let nMax = -Infinity;
      let nSum = 0;
      let nCount = 0;
      for (let jj = j - 2; jj <= j + 2; jj++) {
        for (let ii = i - 2; ii <= i + 2; ii++) {
          const hh = heights[jj * cols + ii];
          nMin = Math.min(nMin, hh);
          nMax = Math.max(nMax, hh);
          nSum += hh;
          nCount++;
        }
      }
      const span = Math.max(4, nMax - nMin);
      const rel = (h - nMin) / span;
      const convex = h - nSum / nCount;
      if (rel < 0.18 || rel > 0.92) continue;
      const slopeS = Math.exp(-((slope - 14) ** 2) / (2 * 36));
      const dAsp = Math.min(Math.abs(aspect - 195), 360 - Math.abs(aspect - 195));
      const aspectS = clamp01(1 - dAsp / 95);
      const elevS = clamp01(1 - Math.abs(rel - 0.58) / 0.38);
      const benchS =
        convex > -1.5 && convex < 4 ? 1 : clamp01(1 - Math.abs(convex) / 8);
      const score = 0.32 * slopeS + 0.34 * aspectS + 0.22 * elevS + 0.12 * benchS;
      if (score < 0.55) continue;
      candidates.push({
        lng: west + ((east - west) * i) / (cols - 1),
        lat: north - ((north - south) * j) / (rows - 1),
        score,
        slope,
        aspect,
        elev: h,
        why:
          (dAsp < 45
            ? "south-warm slope"
            : dAsp < 80
              ? "off-south slope"
              : "sidehill") +
          `, ${slope.toFixed(0)}°, ${h.toFixed(0)} m`,
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  const kept: BedCandidate[] = [];
  const minSep = Math.max(280, cellM * 6);
  for (const c of candidates) {
    if (kept.some((k) => haversineM(k.lng, k.lat, c.lng, c.lat) < minSep))
      continue;
    kept.push(c);
    if (kept.length >= 10) break;
  }
  return kept;
}

export const NS_PRESETS = [
  { name: "Heather Beach", lon: -63.737, lat: 45.876, zoom: 13 },
  { name: "Amherst", lon: -64.213, lat: 45.833, zoom: 12 },
  { name: "Cape Chignecto", lon: -64.85, lat: 45.48, zoom: 12 },
  { name: "Springhill Jct", lon: -64.1025, lat: 45.6935, zoom: 13 },
  { name: "Truro", lon: -63.28, lat: 45.365, zoom: 12 },
  { name: "Cabot Trail", lon: -60.72, lat: 46.65, zoom: 11 },
];
