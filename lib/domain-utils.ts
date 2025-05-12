import { getBaseUrl } from "./url-utils"

// Extract domain from the full URL
const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch (e) {
    return url
  }
}

export const PRIMARY_DOMAIN = extractDomain(getBaseUrl())
