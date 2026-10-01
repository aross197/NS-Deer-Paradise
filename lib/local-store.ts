/**
 * Client-side persistence until Postgres + Auth are configured.
 * Real data on device — not simulated network delays.
 */

const FEED_KEY = "bucktracks_feed_v1";
const CONTACTS_KEY = "bucktracks_contacts_v1";
const HOME_KEY = "bucktracks_home_v1";
const PROFILE_KEY = "bucktracks_profile_v1";

export type ReactionType = "like" | "fire" | "horns" | "respect" | "bow";

export interface StoredPost {
  id: string;
  author: string;
  avatar: string;
  body: string;
  createdAt: number;
  species?: string;
  isBuck?: boolean;
  antlerPoints?: number;
  weapon?: string;
  zone?: string;
  photoDataUrl?: string;
  reactions: Partial<Record<ReactionType, number>>;
  myReaction?: ReactionType | null;
  comments: { id: string; author: string; body: string; createdAt: number }[];
}

export interface StoredContact {
  id: string;
  name: string;
  email: string;
  selected: boolean;
}

export interface HomeBase {
  name: string;
  lat: number;
  lon: number;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFeed(): StoredPost[] {
  return read<StoredPost[]>(FEED_KEY, []);
}

export function saveFeed(posts: StoredPost[]) {
  write(FEED_KEY, posts);
}

export function loadContacts(): StoredContact[] {
  return read<StoredContact[]>(CONTACTS_KEY, []);
}

export function saveContacts(contacts: StoredContact[]) {
  write(CONTACTS_KEY, contacts);
}

export function loadHomeBase(): HomeBase | null {
  return read<HomeBase | null>(HOME_KEY, null);
}

export function saveHomeBase(home: HomeBase) {
  write(HOME_KEY, home);
}

export function loadProfileName(): string {
  return read(PROFILE_KEY, "Hunter");
}

export function saveProfileName(name: string) {
  write(PROFILE_KEY, name);
}

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
