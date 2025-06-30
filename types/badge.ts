export type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "first-response"
  | "application-started"
  | "application-completed"
  | "frequent-user"
  | "resource-downloader"
  | "hard-charger"
  | "connector"
  | "deep-diver"
  | "quick-learner"
  | "persistent-explorer"
  | "dedicated-applicant"
  | "trivia-titan"
  | "sf-baseball-participant"
  | "sf-baseball-enthusiast"
  | "sf-baseball-master"
  | "sf-basketball-participant"
  | "sf-basketball-enthusiast"
  | "sf-basketball-master"
  | "sf-districts-participant"
  | "sf-districts-enthusiast"
  | "sf-districts-master"
  | "sf-football-participant"
  | "sf-football-enthusiast"
  | "sf-football-master"
  | "sf-day-trips-participant"
  | "sf-day-trips-enthusiast"
  | "sf-day-trips-master"
  | "sf-tourist-spots-participant"
  | "sf-tourist-spots-enthusiast"
  | "sf-tourist-spots-master"
  | "point-pioneer"
  | "recruit-referrer"
  | "document-master"
  | "community-event"
  | "holiday-hero"
  | "survey-superstar";

export type BadgeCategory = "achievement" | "process" | "participation";

export type BadgeStatus = "earned" | "progress" | "locked";

export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type BadgeLayoutType =
  | "grid"
  | "list"
  | "timeline"
  | "masonry"
  | "carousel";
export type BadgeDisplayStyle =
  | "standard"
  | "compact"
  | "detailed"
  | "3d"
  | "minimal";
export type BadgeRewardType =
  | "feature"
  | "content"
  | "physical"
  | "points"
  | "custom";

export interface Badge {
  id: string;
  name: string;
  description: string;
  type: BadgeType;
  rarity: BadgeRarity;
  points: number;
  requirements: string[];
  rewards: string[];
  imageUrl?: string;
  tierEnabled?: boolean;
  maxTier?: number;
  parentBadgeId?: string;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BadgeProgress {
  id: string;
  userId: string;
  badgeId: string;
  progress: number;
  status: "in_progress" | "completed";
  actionsCompleted: string[];
  createdAt: string;
  updatedAt: string;
  history?: {
    action: string;
    timestamp: string;
    progress: number;
  }[];
}

export type TimelineEventType =
  | "start"
  | "progress"
  | "milestone"
  | "completion"
  | "unlock"
  | "share";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  badgeId: string;
  event: string;
  date: string;
  userId?: string;
}

export interface BadgeWithProgress extends Badge {
  progress: number;
  earned?: boolean;
  currentTier?: number;
  xpEarned?: number;
  isUnlocked?: boolean;
  progressDetails: BadgeProgress;
  streakCount?: number;
  lastActivity?: string;
  nextMilestone?: {
    value: number;
    reward: BadgeReward;
  };
}

export interface BadgeCollection {
  id: string;
  name: string;
  description: string;
  theme?: string;
  specialReward?: string;
  badges: Badge[];
  progress?: number;
  isComplete?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BadgeTier {
  id: string;
  badgeId: string;
  level: number;
  requirements: string[];
  rewards: string[];
  imageUrl?: string;
  name: string;
  xpRequired: number;
  createdAt: string;
}

export interface UserXP {
  userId: string;
  totalXp: number;
  currentLevel: number;
  streakCount: number;
  lastDailyChallenge?: string;
}

export interface Goal {
  id: string;
  description: string;
  completed: boolean;
  [key: string]: string | number | boolean;
}

export interface BadgeChallenge {
  id: string;
  name: string;
  description: string;
  type: BadgeType;
  progress: Record<string, number>;
  value: number;
  rewardType: "badge" | "points" | "nft";
  rewardData: Record<string, unknown>;
  customGoals: Record<string, Goal> | null;
}

export interface UserChallengeProgress {
  userId: string;
  challengeId: string;
  progress: Record<string, unknown>;
  isComplete: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BadgeShowcaseSettings {
  userId: string;
  layoutType: BadgeLayoutType;
  featuredBadges: string[];
  showcaseTheme: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BadgeAnalytics {
  badgeId: string;
  totalEarned: number;
  averageTimeToEarn: number;
  completionRate: number;
  popularityScore: number;
  updatedAt: string;
}

export interface BadgeReward {
  id: string;
  badgeId: string;
  type: string;
  value: unknown;
  description: string;
  rewardType: BadgeRewardType;
  rewardData: Record<string, unknown>;
  requiredTier: number;
  isActive: boolean;
}

export interface UserBadgePreferences {
  userId: string;
  displayStyle: BadgeDisplayStyle;
  notificationSettings: {
    email: boolean;
    push: boolean;
  };
  pinnedBadges: string[];
  customGoals: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface BadgeFilters {
  type?: BadgeType;
  category?: BadgeCategory;
  status?: BadgeStatus;
  sortBy?: "name" | "progress" | "earned" | "recent";
}

export interface BadgeSearchParams {
  query?: string;
  filters?: BadgeFilters;
  userId?: string;
  status?: BadgeStatus;
  showAll?: boolean;
}

export interface BadgeAwardResult {
  success: boolean;
  alreadyEarned?: boolean;
  badge?: BadgeWithProgress;
  message?: string;
}

export interface BadgeShare {
  id: string;
  userId: string;
  badgeId: string;
  platform: string;
  shareUrl?: string;
  createdAt: string;
}
