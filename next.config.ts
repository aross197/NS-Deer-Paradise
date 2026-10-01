import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // COCO-SSD / tfjs load only on the client via dynamic import in lib/trailcam-ai.ts
  serverExternalPackages: [],
};

export default nextConfig;
