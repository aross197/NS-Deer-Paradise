import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NS Deer Paradise | Every Deer Hunter's Dream",
  description:
    "The ultimate free platform for Nova Scotia deer hunters. Seasons, maps, journals, trail cams, weather, community — register and enter paradise.",
  keywords: [
    "Nova Scotia",
    "deer hunting",
    "whitetail",
    "northern Nova Scotia",
    "hunting journal",
    "trail camera",
    "Crown land",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-stone-950 text-stone-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
