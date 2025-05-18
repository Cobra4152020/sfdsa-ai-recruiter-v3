export type BadgeType = "achievement" | "skill" | "participation" | "special"
export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary"
export type BadgeLayoutType = "grid" | "list" | "masonry" | "carousel"
export type BadgeDisplayStyle = "standard" | "3d" | "minimal" | "detailed"
export type BadgeRewardType = "feature" | "content" | "physical" | "points" | "custom"

export interface Badge {
  id: string
  name: string
  description: string
  type: BadgeType
  rarity: BadgeRarity
  points: number
  requirements: string[]
  rewards: string[]
  imageUrl?: string
  createdAt: string
  updatedAt: string
  tierEnabled?: boolean
  maxTier?: number
  parentBadgeId?: string
  expirationDays?: number
  verificationRequired?: boolean
}

export interface BadgeProgress {
  badgeId: string
  userId: string
  progress: number
  isUnlocked: boolean
  unlockedAt?: string
  lastUpdated: string
  currentTier?: number
  xpEarned?: number
}

export interface TimelineEvent {
  id: number
  date: string
  event: string
  type: "start" | "progress" | "milestone" | "completion"
  badgeId: string
  userId: string
}

export interface BadgeWithProgress extends Badge {
  progress: number
  isUnlocked: boolean
  unlockedAt?: string
  currentTier?: number
  xpEarned?: number
}

export interface BadgeCollection {
  id: string
  name: string
  description?: string
  theme?: string
  specialReward?: string
  badges: Badge[]
  progress?: number
  isComplete?: boolean
}

export interface BadgeTier {
  id: string
  badgeId: string
  tierLevel: number
  name: string
  requirements: string[]
  xpRequired: number
  createdAt: string
}

export interface UserXP {
  userId: string
  totalXp: number
  currentLevel: number
  lastDailyChallenge?: string
  streakCount: number
}

export interface BadgeChallenge {
  id: string
  name: string
  description?: string
  badgeId: string
  startDate?: string
  endDate?: string
  xpReward: number
  requirements: Record<string, any>
  isActive: boolean
}

export interface UserChallengeProgress {
  userId: string
  challengeId: string
  progress: Record<string, any>
  completedAt?: string
}

export interface BadgeShowcaseSettings {
  userId: string
  layoutType: BadgeLayoutType
  featuredBadges: string[]
  showcaseTheme: string
  isPublic: boolean
}

export interface BadgeAnalytics {
  badgeId: string
  totalEarned: number
  completionRate: number
  averageTimeToEarn: string
  popularityScore: number
}

export interface BadgeReward {
  id: string
  badgeId: string
  rewardType: BadgeRewardType
  rewardData: Record<string, any>
  requiredTier: number
  isActive: boolean
}

export interface UserBadgePreferences {
  userId: string
  displayStyle: BadgeDisplayStyle
  notificationSettings: {
    email: boolean
    push: boolean
  }
  pinnedBadges: string[]
  customGoals?: Record<string, any>
} 