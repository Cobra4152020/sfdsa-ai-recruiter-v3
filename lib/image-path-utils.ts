/**
 * Utility functions for handling image paths consistently across the application
 */

/**
 * Get the correct path for an image, handling both development and production environments
 * @param path The relative path to the image in the public directory
 * @returns The correct path to use in the application
 */
export function getImagePath(path: string): string {
  // Remove leading slash if present to ensure consistency
  const cleanPath = path.startsWith("/") ? path.substring(1) : path

  // In production, we might need to adjust paths based on the deployment environment
  // For now, we'll just ensure the path is correctly formatted
  return `/${cleanPath}`
}

/**
 * Check if an image exists at the given path
 * This is useful for development debugging
 * @param path The path to check
 * @returns A promise that resolves to true if the image exists
 */
export async function checkImageExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(getImagePath(path), { method: "HEAD" })
    return response.ok
  } catch (error) {
    console.error(`Error checking image at ${path}:`, error)
    return false
  }
}

/**
 * Get a fallback image path if the original image fails to load
 * @returns A fallback image path
 */
export function getFallbackImagePath(): string {
  return "/abstract-geometric-shapes.png"
}
