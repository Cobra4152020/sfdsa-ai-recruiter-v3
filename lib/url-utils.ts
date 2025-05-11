/**
 * Get the base URL for the application
 * Prioritizes NEXT_PUBLIC_SITE_URL over VERCEL_URL
 */
export function getBaseUrl(): string {
  // First priority: NEXT_PUBLIC_SITE_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // Second priority: VERCEL_URL (for preview deployments)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Fallback for local development
  return "http://localhost:3000"
}

/**
 * Construct a full URL from a path
 */
export function constructUrl(path: string): string {
  const baseUrl = getBaseUrl()
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

/**
 * Get the callback URL for authentication
 */
export function getCallbackUrl(): string {
  return constructUrl("/api/auth/callback")
}

/**
 * Get the login redirect URL
 */
export function getLoginRedirectUrl(): string {
  return constructUrl("/login")
}
