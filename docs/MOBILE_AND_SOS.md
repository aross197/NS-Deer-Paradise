# Mobile + SOS Mode

BuckTracks is built **mobile-first** for use in the truck, stand, and woods.

## Mobile

- Viewport + `viewport-fit=cover` for notched phones
- Safe-area padding (`env(safe-area-inset-*)`)
- Touch targets ≥ 48px on primary actions
- `touch-action: manipulation` (less double-tap zoom delay)
- Horizontal overflow locked
- Feed / cams / safety layouts work on narrow screens
- PWA manifest: Add to Home Screen → opens standalone
- Manifest **SOS shortcut** jumps straight to `/sos`

## SOS mode (`/sos`)

Full-screen emergency flow:

1. Giant **START** button (gloves / cold hands)
2. High-accuracy GPS
3. Back bearing + distance to home base
4. **EMAIL CONTACTS NOW** (or queue if offline)
5. One-tap **Call 911**
6. Online / offline indicator
7. Last GPS cached in `localStorage` if live fix fails
8. Offline alert queued as `bucktracks_pending_sos`

Floating **SOS** button appears on every other page (thumb zone, bottom-right).

## Limits

- Email still needs a network path when sending (or queues until online)
- Not a substitute for 911 / PLB / SAR
- Add real icon PNGs at `public/icon-192.png` and `icon-512.png` for install prompts
