/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Allow HMR / dev resources to be accessed from this host on your network
  // Add other origins if you access the dev server from multiple hosts
  allowedDevOrigins: ['192.168.1.107'],
}

export default nextConfig
