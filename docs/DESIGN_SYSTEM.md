# Design System — World-Class Visual Standard

NS Deer Paradise aims to feel like the best outdoor / hunting product in the world: cinematic, calm, precise, and rooted in the northern Nova Scotia woods — never gimmicky or corporate-tech.

## Principles

1. **Atmosphere over chrome** — Depth comes from light, gradient, and blur, not heavy borders.
2. **Typography hierarchy** — Instrument Serif for emotional headlines; DM Sans for UI clarity.
3. **Restrained gold** — Amber is the accent of the stand light and autumn; used sparingly.
4. **Moss as signal** — Green means open season, success, nature — not generic “go”.
5. **Motion with purpose** — Soft rises, floating ambient orbs, hover lifts. No bounce spam.
6. **Film grain** — Subtle texture so the UI feels photographic, not flat digital plastic.

## Palette

| Token | Hex | Use |
|-------|-----|-----|
| Deep | `#07090a` | Page background |
| Forest 950–700 | `#0c1210` → `#2a3f32` | Panels, cards |
| Amber 300–600 | `#f0c14b` → `#b87a0c` | CTAs, accents, season highlights |
| Moss 400–600 | `#5a9a6e` → `#2d5240` | Open status, success |
| Cream 50–300 | `#faf6f0` → `#d4cbb8` | Text hierarchy |

## Components (CSS classes)

- `.btn-primary` — Gradient gold CTA with glow and lift
- `.btn-ghost` — Quiet secondary action
- `.card-premium` — Depth card with hover elevation
- `.glass` / `.glass-strong` — Frosted panels
- `.text-gradient-amber` / `.text-gradient-cream` — Headline treatments

## Typography

```tsx
// layout.tsx
font-serif  → Instrument Serif (headlines, brand)
font-sans   → DM Sans (body, UI)
```

## Atmosphere

- Hero uses layered radial gradients (`bg-hero-radial`) + floating blurred orbs
- Body has a fixed subtle noise overlay for film character
- Scrollbars match the moss palette

## Ambition

Every screen should feel like standing at the edge of a clear-cut at last light — quiet, intentional, and ready for the hunt. Graphics and motion support the craft; they never distract from it.
