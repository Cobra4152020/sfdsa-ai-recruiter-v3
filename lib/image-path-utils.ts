import { env } from "./env-utils";

/**
 * Resolves an image path based on the current environment
 * @param path The relative path to the image
 * @returns The full path to the image
 */
export function resolveImagePath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // In development or when using mock data, use the local path
  if (
    process.env.NODE_ENV === "development" ||
    env("USE_MOCK_DATA") === "true"
  ) {
    return `/${cleanPath}`;
  }

  // In production, use the Vercel URL
  const baseUrl = env("NEXT_PUBLIC_VERCEL_URL") || "";
  const protocol = baseUrl.includes("localhost") ? "http" : "https";

  if (!baseUrl) {
    console.warn(
      "NEXT_PUBLIC_VERCEL_URL is not defined, falling back to relative path",
    );
    return `/${cleanPath}`;
  }

  return `${protocol}://${baseUrl}/${cleanPath}`;
}

/**
 * Checks if an image exists at the given path
 * @param path The path to check
 * @returns A promise that resolves to true if the image exists
 */
export async function checkImageExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(path, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error(`Error checking if image exists at ${path}:`, error);
    return false;
  }
}

/**
 * Gets a list of all available image paths
 * This is a mock implementation and would need to be replaced with actual logic
 * in a production environment
 */
export function getAvailableImagePaths(): string[] {
  return [
    "/sfdsa-logo.png",
    "/protecting-sf-logo.png",
    "/document-icon.png",
    "/fitness-icon.png",
    "/psychology-icon.png",
    "/chat-icon.png",
    "/generic-badge.png",
    "/diverse-group-brainstorming.png",
    "/sf-sheriff-deputies.png",
    "/male-law-enforcement-headshot.png",
    "/san-francisco-deputy-sheriff.png",
    "/female-law-enforcement-headshot.png",
    "/asian-male-officer-headshot.png",
    "/veterans-law-enforcement-training.png",
    "/san-francisco-apartments.png",
    "/law-enforcement-training.png",
    "/job-interview-preparation.png",
    "/castro-district-san-francisco.png",
    "/san-francisco-cable-car.png",
    "/lombard-street-san-francisco.png",
    "/silicon-valley-tech.png",
    "/north-beach-italian-street.png",
    "/boudin-sourdough.png",
    "/summer-of-love-1967-san-francisco.png",
    "/mission-dolores-san-francisco.png",
    "/1906-san-francisco-aftermath.png",
    "/golden-gate-bridge.png",
    "/alcatraz-prison-san-francisco.png",
    "/1906-san-francisco-earthquake.png",
    "/san-francisco-cable-car-powell.png",
    "/lombard-street-crooked.png",
    "/silicon-valley-tech-hq.png",
    "/north-beach-italian-restaurants.png",
    "/abstract-geometric-shapes.png",
  ];
}

/**
 * Gets the full path to an image
 * @param path The relative path to the image
 * @returns The full path to the image
 */
export function getImagePath(path: string): string {
  return resolveImagePath(path);
}
