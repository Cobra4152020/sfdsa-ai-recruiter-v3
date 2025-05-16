/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'fonts.googleapis.com', 
      'fonts.gstatic.com',
      'sfdeputysheriff.com',
      'www.sfdeputysheriff.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sfdeputysheriff.com',
      },
      {
        protocol: 'https',
        hostname: 'www.sfdeputysheriff.com',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
  // Configure output for Vercel deployment
  output: 'standalone',
  // Disable client reference manifest generation
  generateClientManifest: false,
};

export default nextConfig;
