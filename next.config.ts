import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/singin", destination: "/signin", permanent: true }];
  },
};

export default nextConfig;
