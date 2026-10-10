/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [{ source: "/singin", destination: "/signin", permanent: true }];
  },
};

module.exports = nextConfig
