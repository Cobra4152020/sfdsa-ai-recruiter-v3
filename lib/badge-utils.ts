import type { Badge } from "@/types/badge";

// Define all available badges as a constant
const ALL_BADGES: Badge[] = [
  // Application badges
  {
    id: "written",
    name: "Written Test",
    description: "Completed written test preparation",
    type: "written",
    rarity: "common",
    points: 100,
    requirements: [
      "Complete written test study guide",
      "Score at least 80% on practice test",
      "Review feedback",
    ],
    rewards: [
      "Access to advanced study materials",
      "Test-taking tips",
      "Practice test feedback",
    ],
    imageUrl: "/placeholder.svg?key=t6kke",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "oral",
    name: "Oral Board",
    description: "Prepared for oral board interviews",
    type: "oral",
    rarity: "uncommon",
    points: 150,
    requirements: [
      "Complete interview preparation guide",
      "Practice common questions",
      "Review feedback",
    ],
    rewards: ["Mock interview access", "Interview tips", "Sample answers"],
    imageUrl: "/placeholder.svg?key=409vx",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "physical",
    name: "Physical Test",
    description: "Completed physical test preparation",
    type: "physical",
    rarity: "uncommon",
    points: 150,
    requirements: [
      "Complete fitness assessment",
      "Follow training program",
      "Pass practice test",
    ],
    rewards: ["Training program access", "Fitness tips", "Progress tracking"],
    imageUrl: "/placeholder.svg?key=j0utq",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "polygraph",
    name: "Polygraph",
    description: "Learned about the polygraph process",
    type: "polygraph",
    rarity: "rare",
    points: 200,
    requirements: [
      "Review polygraph guide",
      "Complete questionnaire",
      "Watch preparation video",
    ],
    rewards: ["Detailed guide access", "Sample questions", "Expert tips"],
    imageUrl: "/placeholder.svg?key=r9mwp",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "psychological",
    name: "Psychological",
    description: "Prepared for psychological evaluation",
    type: "psychological",
    rarity: "rare",
    points: 200,
    requirements: [
      "Review evaluation guide",
      "Complete self-assessment",
      "Watch preparation video",
    ],
    rewards: ["Detailed guide access", "Sample questions", "Expert tips"],
    imageUrl: "/placeholder.svg?key=k2nxq",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "full",
    name: "Full Process",
    description: "Completed all preparation areas",
    type: "full",
    rarity: "legendary",
    points: 500,
    requirements: [
      "Earn all achievement badges",
      "Complete application",
      "Attend orientation",
    ],
    rewards: ["Special recognition", "Priority support", "Exclusive content"],
    imageUrl: "/placeholder.svg?key=h7vzt",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Get badge by ID
export async function getBadgeById(id: string): Promise<Badge | null> {
  const badge = ALL_BADGES.find((b) => b.id === id);
  return badge || null;
}

// Get all available badge IDs
export async function getAllBadgeIds(): Promise<string[]> {
  return ALL_BADGES.map((badge) => badge.id);
}

// Award a badge to a user
export async function awardBadge(userId: string, badgeId: string) {
  try {
    // Implementation would go here
    // This is a placeholder since we don't have the actual implementation
    console.log(`Awarding badge ${badgeId} to user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error awarding badge:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Add the missing assignBadgeToUser function
export async function assignBadgeToUser(userId: string, badgeId: string) {
  try {
    // Implementation would go here
    // This is a placeholder since we don't have the actual implementation
    console.log(`Assigning badge ${badgeId} to user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error assigning badge to user:", error);
    return { success: false, error };
  }
}

// Award a badge to a user
export async function awardBadgeToUser(userId: string, badgeId: string) {
  try {
    // Implementation would go here
    // This is a placeholder since we don't have the actual implementation
    console.log(`Awarding badge ${badgeId} to user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error awarding badge:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
