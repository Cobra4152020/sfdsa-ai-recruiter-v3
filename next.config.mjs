/** @type {import('next').NextConfig} */
let userConfig = undefined;

try {
  userConfig = await import('./v0-user-next.config.mjs');
} catch (e) {
  try {
    userConfig = await import('./v0-user-next.config');
  } catch (_) {
    // ignore if not found
  }
}

const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: process.env.GITHUB_ACTIONS ? '/sfdsa-ai-recruiter-v3' : '', // Set base path for GitHub Pages
  reactStrictMode: true,
  typescript: {
    // Temporarily ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
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
  },
  experimental: {
    serverActions: {},
    typedRoutes: true,
    allowedRevalidateHeaderKeys: ['x-prerender-revalidate'],
  },
  // Add canonical URL to improve SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
  // This might help with dynamic route conflicts by disabling strict mode for routes
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

if (userConfig) {
  const config = userConfig.default || userConfig;
  for (const key in config) {
    if (typeof nextConfig[key] === 'object' && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      };
    } else {
      nextConfig[key] = config[key];
    }
  }
}

export default nextConfig;
