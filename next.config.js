/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["m.media-amazon.com", "images-na.ssl-images-amazon.com"],
  },
};

module.exports = nextConfig
