/**
 * Utility functions for managing caching
 */

/**
 * Generates a cache-busting query parameter based on the current build ID
 * @returns A query parameter string like "?v=1.0.0-12345"
 */
export function getCacheBustingParam(): string {
  const buildId = process.env.NEXT_PUBLIC_BUILD_ID || Date.now().toString()
  return `?v=${buildId}-${Math.floor(Math.random() * 10000)}`
}

/**
 * Adds a cache-busting parameter to a URL
 * @param url The URL to add the cache-busting parameter to
 * @returns The URL with a cache-busting parameter
 */
export function addCacheBustingParam(url: string): string {
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}${getCacheBustingParam().substring(1)}`
}

/**
 * Cache control headers for API routes
 */
export const API_CACHE_HEADERS = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
}

/**
 * Adds cache control headers to a response
 * @param response The response to add cache control headers to
 * @returns The response with cache control headers
 */
export function addCacheControlHeaders(response: Response): Response {
  const headers = new Headers(response.headers)

  Object.entries(API_CACHE_HEADERS).forEach(([key, value]) => {
    headers.set(key, value)
  })

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
