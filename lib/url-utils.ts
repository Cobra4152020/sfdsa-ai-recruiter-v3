/**
 * Custom error for URL-related operations
 */
export class UrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UrlError";
  }
}

/**
 * Type for URL configuration
 */
export interface UrlConfig {
  baseUrl: string;
  path: string;
}

/**
 * Type for environment URL sources
 */
export type UrlSource = "NEXT_PUBLIC_SITE_URL" | "VERCEL_URL" | "LOCAL";

/**
 * Get the base URL for the application
 * Prioritizes NEXT_PUBLIC_SITE_URL over VERCEL_URL
 * @throws {UrlError} If no valid base URL can be determined
 */
export function getBaseUrl(): string {
  // First priority: NEXT_PUBLIC_SITE_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      new URL(process.env.NEXT_PUBLIC_SITE_URL);
      return process.env.NEXT_PUBLIC_SITE_URL;
    } catch (error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      throw new UrlError("Invalid NEXT_PUBLIC_SITE_URL format");
    }
  }

  // Second priority: VERCEL_URL (for preview deployments)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback for local development
  return "http://localhost:3000";
}

/**
 * Validate and normalize a URL path
 * @param path The path to validate and normalize
 * @throws {UrlError} If the path is invalid
 */
function validateAndNormalizePath(path: string): string {
  if (!path) {
    throw new UrlError("Path cannot be empty");
  }

  // Remove any trailing slashes
  const trimmedPath = path.trim().replace(/\/+$/, "");

  // Ensure path starts with a slash
  return trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
}

/**
 * Construct a full URL from a path
 * @param path The path to append to the base URL
 * @throws {UrlError} If the resulting URL is invalid
 */
export function constructUrl(path: string): string {
  try {
    const baseUrl = getBaseUrl();
    const normalizedPath = validateAndNormalizePath(path);
    const fullUrl = `${baseUrl}${normalizedPath}`;

    // Validate the constructed URL
    new URL(fullUrl);
    return fullUrl;
  } catch (error) {
    if (error instanceof UrlError) {
      throw error;
    }
    throw new UrlError("Failed to construct valid URL");
  }
}

/**
 * Get the callback URL for authentication
 * @throws {UrlError} If the callback URL cannot be constructed
 */
export function getCallbackUrl(): string {
  return constructUrl("/api/auth/callback");
}

/**
 * Get the login redirect URL
 * @throws {UrlError} If the login redirect URL cannot be constructed
 */
export function getLoginRedirectUrl(): string {
  return constructUrl("/login");
}

/**
 * Get the source of the current base URL
 * @returns The source of the current base URL
 */
export function getBaseUrlSource(): UrlSource {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return "NEXT_PUBLIC_SITE_URL";
  }
  if (process.env.VERCEL_URL) {
    return "VERCEL_URL";
  }
  return "LOCAL";
}
