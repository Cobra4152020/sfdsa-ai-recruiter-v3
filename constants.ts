import type {
  LeaderboardTimeframe,
  LeaderboardCategory,
} from "./types/leaderboard";

/**
 * Default filters for the leaderboard
 */
export const DEFAULT_FILTERS = {
  timeframe: "all" as LeaderboardTimeframe,
  category: "participation" as LeaderboardCategory,
  limit: 10,
  offset: 0,
  search: "",
};

/**
 * Available timeframe options for leaderboard filtering
 */
export const TIMEFRAME_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" },
];

/**
 * Available category options for leaderboard filtering
 */
export const CATEGORY_OPTIONS = [
  { value: "participation", label: "Participation" },
  { value: "badges", label: "Badges" },
  { value: "nfts", label: "NFTs" },
  { value: "applicants", label: "Applicants" },
];

/**
 * Default pagination limits for various components
 */
export const PAGINATION_LIMITS = {
  leaderboard: 10,
  badges: 8,
  nfts: 6,
  activities: 5,
};
