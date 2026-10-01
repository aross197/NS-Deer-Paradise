/**
 * Trail cam AI — runs in the browser with TensorFlow.js COCO-SSD.
 *
 * Categories aligned with MegaDetector-style workflow:
 *   animal | person | vehicle | empty
 *
 * COCO animal classes act as the animal detector. Species (deer/buck) is
 * suggested when mammal-like classes fire; user override always wins.
 * For production-grade MD accuracy, point MEGADETECTOR_URL at a PytorchWildlife service.
 */

import type { ObjectDetection } from "@tensorflow-models/coco-ssd";

export type MdClass = "animal" | "person" | "vehicle" | "empty";

export interface DetectionBox {
  class: string;
  mdClass: MdClass;
  score: number;
  bbox: [number, number, number, number]; // y, x, height, width (coco-ssd format)
}

export interface ExifInfo {
  takenAt: string | null;
  make: string | null;
  model: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface TrailCamAnalysis {
  id: string;
  fileName: string;
  objectUrl: string;
  exif: ExifInfo;
  detections: DetectionBox[];
  hasAnimal: boolean;
  hasPerson: boolean;
  hasVehicle: boolean;
  isEmpty: boolean;
  maxConfidence: number;
  /** Suggested labels — not pure species ID */
  likelyDeer: boolean;
  speciesHint: string | null;
  notes: string;
  analyzedAt: string;
}

const ANIMAL_COCO = new Set([
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
]);

const DEER_HINT = new Set(["horse", "cow", "sheep", "dog", "bear"]);

const VEHICLE_COCO = new Set([
  "bicycle",
  "car",
  "motorcycle",
  "bus",
  "truck",
]);

function toMdClass(label: string): MdClass {
  if (label === "person") return "person";
  if (VEHICLE_COCO.has(label)) return "vehicle";
  if (ANIMAL_COCO.has(label)) return "animal";
  return "empty";
}

let modelPromise: Promise<ObjectDetection> | null = null;

export async function loadDetector(): Promise<ObjectDetection> {
  if (!modelPromise) {
    modelPromise = (async () => {
      await import("@tensorflow/tfjs");
      const cocoSsd = await import("@tensorflow-models/coco-ssd");
      return cocoSsd.load({ base: "lite_mobilenet_v2" });
    })();
  }
  return modelPromise;
}

export async function extractExif(file: File): Promise<ExifInfo> {
  try {
    const exifr = (await import("exifr")).default;
    const data = await exifr.parse(file, {
      pick: ["DateTimeOriginal", "CreateDate", "Make", "Model", "latitude", "longitude", "GPSLatitude", "GPSLongitude"],
      gps: true,
    });
    if (!data) {
      return {
        takenAt: file.lastModified ? new Date(file.lastModified).toISOString() : null,
        make: null,
        model: null,
        latitude: null,
        longitude: null,
      };
    }
    const taken =
      data.DateTimeOriginal || data.CreateDate
        ? new Date(data.DateTimeOriginal || data.CreateDate).toISOString()
        : file.lastModified
          ? new Date(file.lastModified).toISOString()
          : null;
    return {
      takenAt: taken,
      make: data.Make ?? null,
      model: data.Model ?? null,
      latitude: typeof data.latitude === "number" ? data.latitude : null,
      longitude: typeof data.longitude === "number" ? data.longitude : null,
    };
  } catch {
    return {
      takenAt: file.lastModified ? new Date(file.lastModified).toISOString() : null,
      make: null,
      model: null,
      latitude: null,
      longitude: null,
    };
  }
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image"));
    };
    img.src = url;
  });
}

export async function analyzeTrailCamFile(
  file: File,
  model: ObjectDetection
): Promise<TrailCamAnalysis> {
  const [exif, img] = await Promise.all([extractExif(file), loadImageElement(file)]);
  const objectUrl = img.src;

  const raw = await model.detect(img, 20, 0.35);
  const detections: DetectionBox[] = raw.map((d) => ({
    class: d.class,
    mdClass: toMdClass(d.class),
    score: d.score,
    bbox: d.bbox as [number, number, number, number],
  }));

  const animals = detections.filter((d) => d.mdClass === "animal");
  const people = detections.filter((d) => d.mdClass === "person");
  const vehicles = detections.filter((d) => d.mdClass === "vehicle");

  const hasAnimal = animals.length > 0;
  const hasPerson = people.length > 0;
  const hasVehicle = vehicles.length > 0;
  const isEmpty = !hasAnimal && !hasPerson && !hasVehicle;

  const maxConfidence = detections.reduce((m, d) => Math.max(m, d.score), 0);

  const likelyDeer =
    animals.some((a) => DEER_HINT.has(a.class) && a.score >= 0.4) ||
    (hasAnimal && animals[0].score >= 0.55);

  let speciesHint: string | null = null;
  if (hasPerson) speciesHint = "person";
  else if (hasVehicle) speciesHint = "vehicle";
  else if (likelyDeer) speciesHint = "possible deer / large mammal";
  else if (hasAnimal) speciesHint = animals[0].class;

  const notes = isEmpty
    ? "No animal, person, or vehicle above threshold — likely empty frame."
    : `Detected: ${detections.map((d) => `${d.class} ${(d.score * 100).toFixed(0)}%`).join(", ")}`;

  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    fileName: file.name,
    objectUrl,
    exif,
    detections,
    hasAnimal,
    hasPerson,
    hasVehicle,
    isEmpty,
    maxConfidence,
    likelyDeer,
    speciesHint,
    notes,
    analyzedAt: new Date().toISOString(),
  };
}

export type GalleryFilter =
  | "all"
  | "animals"
  | "deer"
  | "empty"
  | "people"
  | "nonempty";

export function filterAnalyses(
  items: TrailCamAnalysis[],
  filter: GalleryFilter
): TrailCamAnalysis[] {
  switch (filter) {
    case "animals":
      return items.filter((i) => i.hasAnimal);
    case "deer":
      return items.filter((i) => i.likelyDeer);
    case "empty":
      return items.filter((i) => i.isEmpty);
    case "people":
      return items.filter((i) => i.hasPerson);
    case "nonempty":
      return items.filter((i) => !i.isEmpty);
    default:
      return items;
  }
}
