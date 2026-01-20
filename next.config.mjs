/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Framer Motion optimization
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  // Improve performance with SWC compiler
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
