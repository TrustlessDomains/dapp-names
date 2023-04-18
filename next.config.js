/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  output: 'standalone',
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.trustless.computer',
      },
    ],
  },
}

module.exports = nextConfig
