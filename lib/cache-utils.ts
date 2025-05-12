/**
 * Add a cache busting parameter to a URL
 */
export function addCacheBustingParam(url: string): string {
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}_=${Date.now()}`
}

/**
 * Cache headers for API responses
 */
export const API_CACHE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Surrogate-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
}
