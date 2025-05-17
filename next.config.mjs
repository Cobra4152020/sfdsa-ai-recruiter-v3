/** @type {import('next').NextConfig} */
const nextConfig = {
  // Let Vercel handle the output mode
  // output: 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

export default nextConfig;
