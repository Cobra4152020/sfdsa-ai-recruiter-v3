/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
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
  // Handle client component references properly
  experimental: {
    serverComponentsExternalPackages: [],
    missingSuspenseWithCSRBailout: false
  },
  // Skip generation of database-dependent API routes
  async exportPathMap(defaultPathMap) {
    // Remove all dynamic API routes from static export
    const filteredPaths = {};
    
    for (const [path, page] of Object.entries(defaultPathMap)) {
      // Skip API routes to avoid database issues during static generation
      if (!path.startsWith('/api/')) {
        filteredPaths[path] = page;
      }
    }
    
    return filteredPaths;
  },
}

export default nextConfig;
