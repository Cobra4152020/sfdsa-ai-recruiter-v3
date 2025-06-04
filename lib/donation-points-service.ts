export interface DonationPointRule {
  id: number;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number | null;
  pointsPerDollar: number;
  recurringMultiplier: number;
  isActive: boolean;
  campaignId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DonationCampaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  pointMultiplier: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationPointsAward {
  userId: string;
  donationId: string;
  points: number;
  isRecurring: boolean;
  amount: number;
}

/**
 * Award points for a donation (server-only)
 */
export async function awardDonationPoints() {
  throw new Error(
    "awardDonationPoints is server-only. Use from lib/donation-points-service-server.ts",
  );
}

/**
 * Get donation point rules (server-only)
 */
export async function getDonationPointRules() {
  throw new Error(
    "getDonationPointRules is server-only. Use from lib/donation-points-service-server.ts",
  );
}

/**
 * Update a donation point rule (server-only)
 */
export async function updateDonationPointRule() {
  throw new Error(
    "updateDonationPointRule is server-only. Use from lib/donation-points-service-server.ts",
  );
}

/**
 * Get active donation campaigns (server-only)
 */
export async function getActiveDonationCampaigns() {
  throw new Error(
    "getActiveDonationCampaigns is server-only. Use from lib/donation-points-service-server.ts",
  );
}

/**
 * Get user donation points (server-only)
 */
export async function getUserDonationPoints() {
  throw new Error(
    "getUserDonationPoints is server-only. Use from lib/donation-points-service-server.ts",
  );
}

/**
 * Get donation leaderboard (server-only)
 */
export async function getDonationLeaderboard() {
  throw new Error(
    "getDonationLeaderboard is server-only. Use from lib/donation-points-service-server.ts",
  );
}
