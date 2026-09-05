import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the parent folder otherwise wins the root inference.
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
      { protocol: "https", hostname: "yt3.googleusercontent.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
