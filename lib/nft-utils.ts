// Helper function to validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Helper function to ensure valid UUID
export function ensureValidUUID(id: string): string {
  if (isValidUUID(id)) {
    return id;
  }
  // For non-UUID strings, generate a deterministic UUID using the string
  const encoder = new TextEncoder();
  const data = encoder.encode(id);
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data[i];
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `00000000-0000-4000-8000-${hash.toString(16).padStart(12, "0")}`;
}

export interface NFTAward {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  pointThreshold: number;
  tokenId?: string;
  contractAddress?: string;
  blockchainExplorerUrl?: string;
}

// Define NFT award tiers
export const NFT_AWARD_TIERS: NFTAward[] = [
  {
    id: "bronze",
    name: "Bronze Recruit",
    description: "Awarded for reaching 1,000 participation points",
    imageUrl: "/nft-awards/bronze-recruit.png",
    pointThreshold: 1000,
  },
  {
    id: "silver",
    name: "Silver Recruit",
    description: "Awarded for reaching 2,500 participation points",
    imageUrl: "/nft-awards/silver-recruit.png",
    pointThreshold: 2500,
  },
  {
    id: "gold",
    name: "Gold Recruit",
    description: "Awarded for reaching 5,000 participation points",
    imageUrl: "/nft-awards/gold-recruit.png",
    pointThreshold: 5000,
  },
  {
    id: "platinum",
    name: "Platinum Recruit",
    description: "Awarded for reaching 10,000 participation points",
    imageUrl: "/nft-awards/platinum-recruit.png",
    pointThreshold: 10000,
  },
];

/**
 * Check if a user has earned any new NFT awards based on their points
 * (Server-only logic removed. Implement this in lib/nft-utils-server.ts)
 */
export async function checkAndAwardNFTs(
  _userId: string,
  _currentPoints: number,
) {
  throw new Error(
    "checkAndAwardNFTs is server-only and must be implemented in lib/nft-utils-server.ts",
  );
}

/**
 * Get all NFT awards for a user
 * (Server-only logic removed. Implement this in lib/nft-utils-server.ts)
 */
export async function getUserNFTAwards(_userId: string) {
  throw new Error(
    "getUserNFTAwards is server-only and must be implemented in lib/nft-utils-server.ts",
  );
}
