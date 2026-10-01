import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SosFab } from "@/components/SosFab";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BuckTracks — Free hunting platform for northern Nova Scotia",
    template: "%s · BuckTracks",
  },
  description:
    "The free deer hunting command center: 3D land 200 m around you, trail cam AI, live weather, SOS, seasons, and crew feed. Built for northern Nova Scotia. No paywall.",
  applicationName: "BuckTracks",
  keywords: [
    "deer hunting",
    "Nova Scotia",
    "trail camera",
    "free hunting app",
    "SOS",
    "BuckTracks",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BuckTracks",
  },
  formatDetection: { telephone: true },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050708" },
    { media: "(prefers-color-scheme: light)", color: "#050708" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans bg-[#050708] text-[#f6f1e8] antialiased pb-safe">
        {children}
        <SosFab />
      </body>
    </html>
  );
}
