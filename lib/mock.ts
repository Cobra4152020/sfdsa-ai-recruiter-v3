import type { LeaderboardUser } from "../types/leaderboard"

/**
 * Generates mock leaderboard data for development and testing
 * @param count Number of mock users to generate
 * @returns Array of mock leaderboard users
 */
export const getMockLeaderboardData = (count = 10): LeaderboardUser[] => {
  const mockUsers: LeaderboardUser[] = []

  for (let i = 0; i < count; i++) {
    mockUsers.push({
      id: `user-${i + 1}`,
      name: `Test User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      avatar_url: `/placeholder.svg?height=40&width=40&query=avatar${i + 1}`,
      participation_count: Math.floor(Math.random() * 1000),
      badge_count: Math.floor(Math.random() * 20),
      nft_count: Math.floor(Math.random() * 5),
      applicant_count: Math.floor(Math.random() * 10),
      rank: i + 1,
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  // Sort by participation count in descending order
  return mockUsers.sort((a, b) => b.participation_count - a.participation_count)
}

/**
 * Generates a mock user profile for development and testing
 * @param userId User ID to generate profile for
 * @returns Mock user profile data
 */
export const getMockUserProfile = (userId: string) => {
  return {
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
    avatar_url: `/placeholder.svg?height=100&width=100&query=profile${userId}`,
    bio: "This is a mock user profile for testing purposes.",
    location: "San Francisco, CA",
    website: "https://example.com",
    twitter: "twitterhandle",
    linkedin: "linkedinprofile",
    github: "githubusername",
    created_at: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
    participation_count: Math.floor(Math.random() * 1000),
    badge_count: Math.floor(Math.random() * 20),
    nft_count: Math.floor(Math.random() * 5),
    applicant_count: Math.floor(Math.random() * 10),
  }
}

/**
 * Generates mock badge data for development and testing
 * @param count Number of mock badges to generate
 * @returns Array of mock badges
 */
export const getMockBadges = (count = 8) => {
  const badges = []

  for (let i = 0; i < count; i++) {
    badges.push({
      id: `badge-${i + 1}`,
      name: `Test Badge ${i + 1}`,
      description: `This is a description for test badge ${i + 1}`,
      image_url: `/placeholder.svg?height=80&width=80&query=badge${i + 1}`,
      criteria: `Earn this badge by completing task ${i + 1}`,
      points: (i + 1) * 10,
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return badges
}

/**
 * Generates mock NFT award data for development and testing
 * @param count Number of mock NFTs to generate
 * @returns Array of mock NFT awards
 */
export const getMockNFTAwards = (count = 6) => {
  const nfts = []

  for (let i = 0; i < count; i++) {
    nfts.push({
      id: `nft-${i + 1}`,
      name: `Test NFT ${i + 1}`,
      description: `This is a description for test NFT ${i + 1}`,
      image_url: `/placeholder.svg?height=200&width=200&query=nft${i + 1}`,
      token_id: `token-${i + 1}`,
      blockchain: "Ethereum",
      contract_address: `0x${Array(40)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`,
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return nfts
}
