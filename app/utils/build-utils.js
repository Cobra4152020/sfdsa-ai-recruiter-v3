/**
 * Utilities for handling static build vs dynamic runtime environments
 */

/**
 * Determines if we're currently in a static build environment
 */
export function isStaticBuild() {
  // Check if we're running in a static build context (Vercel static export) AND in production
  return (
    (process.env.NEXT_PUBLIC_STATIC_BUILD === "true" && process.env.NODE_ENV === "production") ||
    (process.env.NEXT_PUBLIC_DISABLE_DATABASE_CHECKS === "true" && process.env.NODE_ENV === "production")
  );
}

/**
 * Safe database connection that returns mock data during static builds
 * @param {Function} dbFetchFunction - The database fetch function to execute
 * @param {*} mockData - Mock data to return during static builds
 */
export async function safeDatabaseFetch(dbFetchFunction, mockData = []) {
  if (isStaticBuild()) {
    // Return mock data during static builds
    return mockData;
  }

  try {
    // Execute the real database function in production
    return await dbFetchFunction();
  } catch (error) {
    console.error("Database fetch error:", error);
    return mockData;
  }
}

/**
 * Determines if a feature that requires database access should be enabled
 */
export function isDatabaseFeatureEnabled() {
  return !isStaticBuild();
}
