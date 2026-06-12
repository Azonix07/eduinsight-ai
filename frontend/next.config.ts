import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for proper Vercel deployment
  output: "standalone",

  // Allow images from any HTTPS source (Cloudinary, S3, etc.)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.s3.amazonaws.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },

  // Forward /api/* to the backend at build time (for SSR)
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:4000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
