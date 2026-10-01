"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReactionType = "like" | "fire" | "horns" | "respect" | "bow";

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "fire", emoji: "🔥", label: "Fire" },
  { type: "horns", emoji: "🦌", label: "Horns" },
  { type: "respect", emoji: "🫡", label: "Respect" },
  { type: "bow", emoji: "🏹", label: "Bow" },
];

interface DemoPost {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  body: string;
  species?: string;
  isBuck?: boolean;
  antlerPoints?: number;
  weapon?: string;
  zone?: string;
  photoPlaceholder?: string;
  reactions: Partial<Record<ReactionType, number>>;
  myReaction?: ReactionType | null;
  comments: { author: string; body: string; timeAgo: string }[];
}

const INITIAL_POSTS: DemoPost[] = [
  {
    id: "1",
    author: "Mike from Antigonish",
    avatar: "M",
    timeAgo: "2h",
    body: "First deer of the season. Quiet sit on the ridge, came through at last light. Grateful and freezer full.",
    species: "Whitetail",
    isBuck: true,
    antlerPoints: 8,
    weapon: "Rifle",
    zone: "105",
    photoPlaceholder: "Buck · Zone 105",
    reactions: { like: 12, horns: 8, respect: 5, fire: 3 },
    myReaction: null,
    comments: [
      { author: "Sarah", body: "Beast of a deer. Congrats brother.", timeAgo: "1h" },
      { author: "Dad's crew", body: "That's a good one. See you at the butcher.", timeAgo: "45m" },
    ],
  },
  {
    id: "2",
    author: "Jess · Pictou County",
    avatar: "J",
    timeAgo: "5h",
    body: "Youth hunt with my nephew. He made a clean shot. Proud doesn't cover it.",
    species: "Whitetail",
    isBuck: false,
    weapon: "Youth · supervised",
    zone: "102",
    photoPlaceholder: "Youth harvest",
    reactions: { respect: 24, like: 18, bow: 6 },
    myReaction: "respect",
    comments: [
      { author: "Uncle Ray", body: "That's what it's all about. Teach them right.", timeAgo: "3h" },
    ],
  },
  {
    id: "3",
    author: "Colchester Camo",
    avatar: "C",
    timeAgo: "Yesterday",
    body: "Not a kill post — just a reminder. Tag your deer, fill the return, respect the land. See you in the woods.",
    reactions: { like: 31, respect: 14 },
    myReaction: null,
    comments: [],
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState<DemoPost[]>(INITIAL_POSTS);
  const [composer, setComposer] = useState("");
  const [showComposerDetails, setShowComposerDetails] = useState(false);
  const [species, setSpecies] = useState("Whitetail");
  const [isBuck, setIsBuck] = useState(true);
  const [points, setPoints] = useState("");
  const [weapon, setWeapon] = useState("Rifle");
  const [zone, setZone] = useState("");
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [pickerFor, setPickerFor] = useState<string | null>(null);

  const totalReactions = (p: DemoPost) =>
    Object.values(p.reactions).reduce((a, b) => a + (b ?? 0), 0);

  const react = (postId: string, type: ReactionType) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const reactions = { ...p.reactions };
        const prevType = p.myReaction;

        if (prevType && reactions[prevType]) {
          reactions[prevType] = Math.max(0, (reactions[prevType] ?? 0) - 1);
        }

        if (prevType === type) {
          return { ...p, reactions, myReaction: null };
        }

        reactions[type] = (reactions[type] ?? 0) + 1;
        return { ...p, reactions, myReaction: type };
      })
    );
    setPickerFor(null);
  };

  const publish = () => {
    if (!composer.trim()) return;
    const post: DemoPost = {
      id: String(Date.now()),
      author: "You",
      avatar: "Y",
      timeAgo: "Just now",
      body: composer.trim(),
      species: showComposerDetails ? species : undefined,
      isBuck: showComposerDetails ? isBuck : undefined,
      antlerPoints:
        showComposerDetails && points ? parseInt(points, 10) || undefined : undefined,
      weapon: showComposerDetails ? weapon : undefined,
      zone: showComposerDetails && zone ? zone : undefined,
      photoPlaceholder: showComposerDetails ? "Your harvest photo" : undefined,
      reactions: {},
      myReaction: null,
      comments: [],
    };
    setPosts((p) => [post, ...p]);
    setComposer("");
    setShowComposerDetails(false);
    setPoints("");
    setZone("");
  };

  const addComment = (postId: string) => {
    const text = (commentDraft[postId] ?? "").trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { author: "You", body: text, timeAgo: "Just now" },
              ],
            }
          : p
      )
    );
    setCommentDraft((d) => ({ ...d, [postId]: "" }));
  };

  const reactionSummary = useMemo(() => {
    return (p: DemoPost) => {
      const parts = REACTIONS.filter((r) => (p.reactions[r.type] ?? 0) > 0).map(
        (r) => `${r.emoji} ${p.reactions[r.type]}`
      );
      return parts.join("  ");
    };
  }, []);

  return (
    <div className="min-h-screen bg-deep text-cream-100">
      <nav className="sticky top-0 z-20 border-b border-white/[0.04] glass-strong">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg tracking-wide">
            NS Deer Paradise
          </Link>
          <div className="flex items-center gap-4 text-sm text-cream-300/60">
            <Link href="/feed" className="text-amber-400 font-medium">
              Feed
            </Link>
            <Link href="/cams" className="hover:text-cream-100">
              Cams
            </Link>
            <Link href="/safety" className="text-red-400/80 hover:text-red-300">
              Lost
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="font-serif text-2xl text-cream-50 tracking-tight">Crew Feed</h1>
          <p className="text-sm text-cream-300/45 mt-1">
            Post your harvest. React. Keep it respectful.
          </p>
        </div>

        {/* Composer — Facebook-style */}
        <div className="card-premium p-4 mb-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-sm font-medium text-amber-300 shrink-0">
              Y
            </div>
            <div className="flex-1">
              <textarea
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
                placeholder="Share a harvest, a sit, or a tip…"
                rows={3}
                className="w-full bg-transparent text-cream-100 placeholder:text-cream-300/30 text-sm resize-none focus:outline-none"
              />
              {showComposerDetails && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <label className="text-cream-300/50 text-xs col-span-2">Harvest details</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="rounded-lg bg-forest-900 border border-white/10 px-2 py-1.5 text-cream-200"
                  >
                    <option>Whitetail</option>
                    <option>Black bear</option>
                    <option>Other</option>
                  </select>
                  <select
                    value={isBuck ? "buck" : "doe"}
                    onChange={(e) => setIsBuck(e.target.value === "buck")}
                    className="rounded-lg bg-forest-900 border border-white/10 px-2 py-1.5 text-cream-200"
                  >
                    <option value="buck">Buck</option>
                    <option value="doe">Doe</option>
                  </select>
                  <input
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    placeholder="Points (e.g. 8)"
                    className="rounded-lg bg-forest-900 border border-white/10 px-2 py-1.5 text-cream-200 placeholder:text-cream-300/30"
                  />
                  <select
                    value={weapon}
                    onChange={(e) => setWeapon(e.target.value)}
                    className="rounded-lg bg-forest-900 border border-white/10 px-2 py-1.5 text-cream-200"
                  >
                    <option>Rifle</option>
                    <option>Bow</option>
                    <option>Muzzleloader</option>
                    <option>Other</option>
                  </select>
                  <input
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Zone (e.g. 105)"
                    className="rounded-lg bg-forest-900 border border-white/10 px-2 py-1.5 text-cream-200 placeholder:text-cream-300/30 col-span-2"
                  />
                </div>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowComposerDetails((v) => !v)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      showComposerDetails
                        ? "border-amber-500/40 text-amber-300 bg-amber-500/10"
                        : "border-white/10 text-cream-300/50 hover:border-white/20"
                    }`}
                  >
                    🦌 Kill / harvest details
                  </button>
                  <button
                    type="button"
                    className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-cream-300/50 hover:border-white/20"
                  >
                    📷 Photo
                  </button>
                </div>
                <button
                  type="button"
                  onClick={publish}
                  disabled={!composer.trim()}
                  className="btn-primary text-xs py-2 px-5 disabled:opacity-40"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="card-premium overflow-hidden">
              {/* Header */}
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-moss-500/20 border border-moss-500/30 flex items-center justify-center text-sm font-medium text-moss-400">
                  {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-cream-50 text-sm truncate">{post.author}</p>
                  <p className="text-xs text-cream-300/40">{post.timeAgo}</p>
                </div>
              </div>

              {/* Body */}
              <div className="px-4 pb-3">
                <p className="text-sm text-cream-200/90 leading-relaxed whitespace-pre-wrap">
                  {post.body}
                </p>
                {(post.species || post.weapon || post.zone) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.species && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-cream-300/70">
                        {post.species}
                        {post.isBuck === true
                          ? " · Buck"
                          : post.isBuck === false
                            ? " · Doe"
                            : ""}
                        {post.antlerPoints ? ` · ${post.antlerPoints} pts` : ""}
                      </span>
                    )}
                    {post.weapon && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-cream-300/70">
                        {post.weapon}
                      </span>
                    )}
                    {post.zone && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-cream-300/70">
                        Zone {post.zone}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Photo placeholder */}
              {post.photoPlaceholder && (
                <div className="mx-4 mb-3 aspect-[4/3] rounded-xl bg-gradient-to-br from-forest-800 to-forest-950 border border-white/5 flex items-center justify-center">
                  <span className="text-cream-300/30 text-sm">{post.photoPlaceholder}</span>
                </div>
              )}

              {/* Reaction counts */}
              {totalReactions(post) > 0 && (
                <div className="px-4 pb-2 text-xs text-cream-300/45">
                  {reactionSummary(post)}
                  {post.comments.length > 0 && (
                    <span className="float-right">
                      {post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              )}

              {/* Action bar */}
              <div className="border-t border-white/[0.04] px-2 py-1 flex relative">
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() =>
                      setPickerFor((id) => (id === post.id ? null : post.id))
                    }
                    className={`w-full py-2.5 text-sm rounded-lg transition ${
                      post.myReaction
                        ? "text-amber-300"
                        : "text-cream-300/50 hover:bg-white/[0.03]"
                    }`}
                  >
                    {post.myReaction
                      ? REACTIONS.find((r) => r.type === post.myReaction)?.emoji
                      : "👍"}{" "}
                    {post.myReaction
                      ? REACTIONS.find((r) => r.type === post.myReaction)?.label
                      : "React"}
                  </button>
                  {pickerFor === post.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex gap-1 p-2 rounded-full glass-strong border border-white/10 shadow-deep z-10">
                      {REACTIONS.map((r) => (
                        <button
                          key={r.type}
                          type="button"
                          title={r.label}
                          onClick={() => react(post.id, r.type)}
                          className="w-10 h-10 text-xl rounded-full hover:bg-white/10 hover:scale-125 transition"
                        >
                          {r.emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenComments((o) => ({ ...o, [post.id]: !o[post.id] }))
                  }
                  className="flex-1 py-2.5 text-sm text-cream-300/50 hover:bg-white/[0.03] rounded-lg transition"
                >
                  💬 Comment
                </button>
              </div>

              {/* Comments */}
              {openComments[post.id] && (
                <div className="border-t border-white/[0.04] px-4 py-3 space-y-3 bg-black/20">
                  {post.comments.map((c, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-medium text-cream-100">{c.author}</span>{" "}
                      <span className="text-cream-300/70">{c.body}</span>
                      <span className="block text-[10px] text-cream-300/30 mt-0.5">
                        {c.timeAgo}
                      </span>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <input
                      value={commentDraft[post.id] ?? ""}
                      onChange={(e) =>
                        setCommentDraft((d) => ({ ...d, [post.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addComment(post.id);
                      }}
                      placeholder="Write a comment…"
                      className="flex-1 rounded-full bg-forest-900 border border-white/10 px-4 py-2 text-sm text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-amber-500/40"
                    />
                    <button
                      type="button"
                      onClick={() => addComment(post.id)}
                      className="text-sm text-amber-400 font-medium px-2"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-cream-300/25">
          Respect the animal. Respect the land. No trash talk.
        </p>
      </main>
    </div>
  );
}
