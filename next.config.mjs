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
  // Configure experimental features
  experimental: {
    typedRoutes: true,
  },
  // Configure environment variables
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.GITHUB_ACTIONS ? '/sfdsa-ai-recruiter-v3' : '',
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
