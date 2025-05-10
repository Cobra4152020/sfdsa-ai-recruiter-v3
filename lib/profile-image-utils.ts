/**
 * Utility functions for handling profile images consistently across the application
 */
import { getImagePath } from "./image-path-utils"

// Map user IDs to specific profile images
const USER_IMAGE_MAP: Record<number, string> = {
  1: "male-law-enforcement-headshot.png",
  2: "female-law-enforcement-headshot.png",
  3: "asian-male-officer-headshot.png",
  4: "san-francisco-deputy-sheriff.png",
}

/**
 * Get a profile image URL based on user ID
 * @param userId The user ID
 * @returns The profile image URL
 */
export function getProfileImageByUserId(userId: number): string {
  // Use the mapped image or fall back to a default based on user ID modulo
  const imagePath = USER_IMAGE_MAP[userId] || `profile-${(userId % 4) + 1}.png`
  return getImagePath(imagePath)
}

/**
 * Get a fallback profile image if the main one fails to load
 * @returns A fallback profile image URL
 */
export function getFallbackProfileImage(): string {
  return getImagePath("male-law-enforcement-headshot.png")
}

/**
 * Get a random profile image from the available options
 * @returns A random profile image URL
 */
export function getRandomProfileImage(): string {
  const images = Object.values(USER_IMAGE_MAP)
  return getImagePath(images[Math.floor(Math.random() * images.length)])
}
