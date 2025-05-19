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
  | "dedicated-applicant";

export type BadgeCategory = "achievement" | "process" | "participation";

export type BadgeStatus = "earned" | "progress" | "locked";

export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type BadgeLayoutType = "grid" | "list" | "timeline" | "masonry" | "carousel";
export type BadgeDisplayStyle = "standard" | "compact" | "detailed" | "3d" | "minimal";
export type BadgeRewardType = "feature" | "content" | "physical" | "points" | "custom";

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
  badgeId: string;
  userId: string;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  actionsCompleted: any[];
  lastActionAt: string;
  createdAt: string;
  updatedAt: string;
  history?: any[];
  lastUpdated?: string;
}

export type TimelineEventType = 'start' | 'progress' | 'milestone' | 'completion' | 'unlock' | 'share';

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

export interface BadgeChallenge {
  id: string;
  title: string;
  description: string;
  badgeId: string;
  requirements: string[];
  rewards: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  xpReward: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserChallengeProgress {
  userId: string;
  challengeId: string;
  progress: Record<string, any>;
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
  value: any;
  description: string;
  rewardType: BadgeRewardType;
  rewardData: Record<string, any>;
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
  customGoals: Record<string, any> | null;
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