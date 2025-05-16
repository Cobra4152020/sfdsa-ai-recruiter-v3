/** @type {import('next').NextConfig} */
let userConfig = undefined;

try {
  userConfig = await import('./v0-user-next.config.mjs');
  console.log('Successfully loaded user config from v0-user-next.config.mjs');
} catch (e) {
  try {
    userConfig = await import('./v0-user-next.config');
    console.log('Successfully loaded user config from v0-user-next.config');
  } catch (error) {
    console.log('No user config found. Using default configuration.');
    if (process.env.NODE_ENV === 'development') {
      console.debug('User config load error:', error);
    }
  }
}

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
    // Add typedRoutes to help with dynamic route conflicts
    typedRoutes: true,
    // This might help with dynamic route parameter conflicts
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
