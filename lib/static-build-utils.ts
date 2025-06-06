/**
 * Utility functions for handling static builds
 * Prevents API route calls when building static exports
 */

export const isStaticBuild = () => {
  return process.env.NEXT_PUBLIC_STATIC_BUILD === "true";
};

export const safeApiFetch = async (url: string, options?: RequestInit) => {
  // If we're in a static build, don't make API calls
  if (isStaticBuild()) {
    console.log(`Static build detected - skipping API call to: ${url}`);
    throw new Error('API routes disabled in static builds');
  }

  // Normal fetch in non-static builds
  return fetch(url, options);
};

export const handleStaticBuildError = (error: any, fallbackData: any) => {
  if (error.message?.includes('API routes disabled') || 
      error.message?.includes('static builds') ||
      isStaticBuild()) {
    console.log('Using fallback data for static build');
    return {
      ok: true,
      data: fallbackData,
      source: 'fallback',
      message: 'Using sample data for demonstration'
    };
  }
  
  // Re-throw other errors
  throw error;
}; 