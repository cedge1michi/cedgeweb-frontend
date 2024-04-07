/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/docs",
        destination: "/docs/index.html",
      },
    ];
  },
};

export default nextConfig;
