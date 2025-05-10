/**
 * Returns the base URL of the application based on environment variables
 * Prioritizes NEXT_PUBLIC_SITE_URL for production environments
 */
export function getBaseUrl(): string {
  // First priority: NEXT_PUBLIC_SITE_URL (explicitly set for production)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // Second priority: Vercel deployment URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }

  // Third priority: VERCEL_URL (server-side only)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Fallback for local development
  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://sfdsa-ai-recruiter.vercel.app"
}

/**
 * Constructs a full URL by appending the path to the base URL
 */
export function constructUrl(path: string): string {
  const baseUrl = getBaseUrl()
  // Ensure path starts with / and there's no double //
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}
