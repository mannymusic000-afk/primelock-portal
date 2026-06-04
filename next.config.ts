import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint:     { ignoreDuringBuilds: true },
  async rewrites() {
    return [
      {
        source: '/api/primelock/:path*',
        destination: 'https://primelock-api.onrender.com/:path*',
      },
    ];
  },
};

export default nextConfig;
