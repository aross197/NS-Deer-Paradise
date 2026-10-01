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
  title: "BuckTracks | Northern Nova Scotia Deer Hunting",
  description:
    "Mobile-first hunting platform: seasons, trail cams, crew feed, and SOS / I Am Lost safety with GPS and back bearing.",
  applicationName: "BuckTracks",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BuckTracks",
  },
  formatDetection: {
    telephone: true,
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07090a" },
    { media: "(prefers-color-scheme: light)", color: "#07090a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans bg-[#07090a] text-[#f4efe6] antialiased pb-safe">
        {children}
        <SosFab />
      </body>
    </html>
  );
}
