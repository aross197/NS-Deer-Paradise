"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Floating SOS control — large touch target, safe-area aware.
 * Hidden on /sos and /safety so it does not cover the main emergency UI.
 */
export function SosFab() {
  const pathname = usePathname();
  if (pathname === "/sos" || pathname === "/safety") return null;

  return (
    <Link
      href="/sos"
      aria-label="SOS — I Am Lost"
      className="sos-fab fixed z-[100] flex items-center justify-center rounded-full bg-red-600 text-white font-bold shadow-[0_4px_24px_rgba(220,38,38,0.55)] active:scale-95 transition-transform border-2 border-red-400/40"
    >
      SOS
    </Link>
  );
}
