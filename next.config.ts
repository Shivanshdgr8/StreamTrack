import type { NextConfig } from "next";
import { setDefaultResultOrder } from "node:dns";

if (typeof setDefaultResultOrder === "function") {
  // Forces IPv4 resolution first; helps avoid ECONNRESET on IPv6-flaky networks.
  setDefaultResultOrder("ipv4first");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
