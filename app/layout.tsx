import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

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
  title: "NS Deer Paradise | The Ultimate Northern Nova Scotia Deer Hunting Platform",
  description:
    "World-class free platform for Nova Scotia deer hunters. Seasons, accurate trail cam reader, maps, journals, weather, community. Register and enter paradise.",
  keywords: [
    "Nova Scotia",
    "deer hunting",
    "whitetail",
    "northern Nova Scotia",
    "trail camera AI",
    "Crown land",
    "hunting journal",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans bg-[#07090a] text-[#f4efe6] antialiased">
        {children}
      </body>
    </html>
  );
}
