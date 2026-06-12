import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from any HTTPS source (Cloudinary, S3, etc.)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.s3.amazonaws.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },

  // Forward /api/* to the backend (only when API URL is configured)
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return [];

    const backendUrl = apiUrl.replace(/\/api\/?$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

