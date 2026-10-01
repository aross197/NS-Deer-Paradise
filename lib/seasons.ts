/**
 * Nova Scotia Deer Season data for 2026-2027
 * Sources: Official NS DNR regulations & summary.
 * Always verify with the latest official guide before hunting.
 */

export type DeerSeasonType = "archery-muzzleloader" | "youth" | "general";

export interface SeasonWindow {
  type: DeerSeasonType;
  label: string;
  start: string; // ISO date
  end: string;
  bagLimit: number;
  notes: string;
  weapons?: string[];
}

export const NS_DEER_SEASONS_2026: SeasonWindow[] = [
  {
    type: "archery-muzzleloader",
    label: "Archery & Muzzleloader",
    start: "2026-09-14",
    end: "2026-12-12",
    bagLimit: 1,
    notes:
      "Sep 14–Sep 26 is bow-only. Primitive weapons only (bow 40 lb+, crossbow 150 lb+, muzzleloader .45+).",
    weapons: ["bow", "crossbow", "muzzleloader"],
  },
  {
    type: "youth",
    label: "Youth Deer Hunt",
    start: "2026-10-16",
    end: "2026-10-24",
    bagLimit: 1,
    notes:
      "Ages 12–17 under immediate supervision of a certified adult 18+. Weapon must match supervisor certification.",
    weapons: ["any legal for the supervising adult"],
  },
  {
    type: "general",
    label: "General Firearm Season",
    start: "2026-10-30",
    end: "2026-12-12",
    bagLimit: 1,
    notes:
      "Standard rifle/shotgun season. Extended by one week for 2026. Sunday hunting expanded.",
    weapons: ["rifle .23+", "shotgun with single projectile or AAA/No.4+", "etc."],
  },
];

/** Deer Management Zones where either sex is allowed without antlerless stamp (2026) */
export const EITHER_SEX_ZONES = ["101", "102", "105", "107", "109"];

/** Zones that typically require antlerless draw stamp for does */
export const ANTLERLESS_DRAW_ZONES = ["103", "104", "106", "108", "110", "111", "112"];

export function getCurrentSeasonStatus(date: Date = new Date()): {
  isOpen: boolean;
  activeSeasons: SeasonWindow[];
  message: string;
} {
  const iso = date.toISOString().slice(0, 10);
  const active = NS_DEER_SEASONS_2026.filter(
    (s) => iso >= s.start && iso <= s.end
  );

  if (active.length === 0) {
    return {
      isOpen: false,
      activeSeasons: [],
      message: "No deer season currently open. Check the calendar for upcoming dates.",
    };
  }

  return {
    isOpen: true,
    activeSeasons: active,
    message: `Open: ${active.map((s) => s.label).join(", ")}`,
  };
}

export const OFFICIAL_LINKS = {
  summaryPdf:
    "https://novascotia.ca/natr/hunt/pdf/hunting-and-furharvesting-summary-of-regulations.pdf",
  deerRegs: "https://novascotia.ca/just/regulations/regs/wideer.htm",
  dnrHunt: "https://novascotia.ca/natr/hunt/",
  antlerlessDraw: "https://novascotia.ca/natr/hunt/", // update when live
};
