/**
 * Timeframe options for leaderboard filtering
 */
export type LeaderboardTimeframe = "today" | "week" | "month" | "all";

/**
 * Category options for leaderboard filtering
 */
export type LeaderboardCategory =
  | "participation"
  | "badges"
  | "nfts"
  | "applicants";

/**
 * Filters for leaderboard data
 */
export interface LeaderboardFilters {
  timeframe: LeaderboardTimeframe;
  category: LeaderboardCategory;
  limit: number;
  offset: number;
  search?: string;
}

/**
 * User data structure for leaderboard display
 */
export interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  participation_count: number;
  badge_count: number;
  nft_count: number;
  applicant_count: number;
  rank: number;
  created_at: string;
}

/**
 * Response structure for leaderboard data
 */
export interface LeaderboardResponse {
  users: LeaderboardUser[];
  total: number;
}
