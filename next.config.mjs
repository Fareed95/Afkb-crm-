/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep dev assets separate from production builds. Otherwise running
  // `next build` while the dev server is active replaces its CSS/chunks.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  }
};

export default nextConfig;
