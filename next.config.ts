import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage (media library uploads)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
