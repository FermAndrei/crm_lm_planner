import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_BEARER_TOKEN: process.env.API_BEARER_TOKEN,
  },
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.API_BASE_URL ||
      "http://10.27.1.155:8089";

    return [
      {
        source: "/api/public/v1/dev/:path*",
        destination: `${backendUrl.replace(/\/+$/, "")}/api/public/v1/dev/:path*`,
      },
    ];
  },
};

export default nextConfig;
