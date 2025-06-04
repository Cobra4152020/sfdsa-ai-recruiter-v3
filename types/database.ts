import type {
  Badge,
  BadgeType,
  BadgeRarity,
  BadgeProgress,
  BadgeCollection,
  BadgeChallenge,
  UserChallengeProgress,
  BadgeShowcaseSettings,
  UserBadgePreferences,
  BadgeAnalytics,
  BadgeShare,
} from "./badge";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      badges: {
        Row: Omit<Badge, "imageUrl"> & { image_url: string | null };
        Insert: Omit<Badge, "id" | "createdAt" | "updatedAt" | "imageUrl"> & {
          id?: string;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<Badge, "id" | "createdAt" | "updatedAt" | "imageUrl">
        > & {
          id?: string;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      badge_progress: {
        Row: Omit<BadgeProgress, "badgeId" | "userId"> & {
          id: string;
          badge_id: string;
          user_id: string;
        };
        Insert: Omit<
          BadgeProgress,
          "badgeId" | "userId" | "createdAt" | "updatedAt"
        > & {
          id?: string;
          badge_id: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<BadgeProgress, "badgeId" | "userId" | "createdAt" | "updatedAt">
        > & {
          id?: string;
          badge_id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      badge_collections: {
        Row: Omit<BadgeCollection, "badges">;
        Insert: Omit<
          BadgeCollection,
          "id" | "badges" | "createdAt" | "updatedAt"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<BadgeCollection, "id" | "badges" | "createdAt" | "updatedAt">
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      badge_collection_memberships: {
        Row: {
          id: string;
          collection_id: string;
          badge_id: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          collection_id: string;
          badge_id: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          collection_id?: string;
          badge_id?: string;
          position?: number;
          created_at?: string;
        };
      };
      badge_challenges: {
        Row: Omit<BadgeChallenge, "badgeId"> & { badge_id: string | null };
        Insert: Omit<
          BadgeChallenge,
          "id" | "badgeId" | "createdAt" | "updatedAt"
        > & {
          id?: string;
          badge_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<BadgeChallenge, "id" | "badgeId" | "createdAt" | "updatedAt">
        > & {
          id?: string;
          badge_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_challenge_progress: {
        Row: Omit<UserChallengeProgress, "userId" | "challengeId"> & {
          id: string;
          user_id: string;
          challenge_id: string;
        };
        Insert: Omit<
          UserChallengeProgress,
          "userId" | "challengeId" | "createdAt" | "updatedAt"
        > & {
          id?: string;
          user_id: string;
          challenge_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<
            UserChallengeProgress,
            "userId" | "challengeId" | "createdAt" | "updatedAt"
          >
        > & {
          id?: string;
          user_id?: string;
          challenge_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      badge_showcase_settings: {
        Row: Omit<BadgeShowcaseSettings, "userId"> & { user_id: string };
        Insert: Omit<
          BadgeShowcaseSettings,
          "userId" | "createdAt" | "updatedAt"
        > & {
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<BadgeShowcaseSettings, "userId" | "createdAt" | "updatedAt">
        > & {
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_badge_preferences: {
        Row: Omit<UserBadgePreferences, "userId"> & { user_id: string };
        Insert: Omit<
          UserBadgePreferences,
          "userId" | "createdAt" | "updatedAt"
        > & {
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<UserBadgePreferences, "userId" | "createdAt" | "updatedAt">
        > & {
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      badge_analytics: {
        Row: Omit<BadgeAnalytics, "badgeId"> & { badge_id: string };
        Insert: Omit<BadgeAnalytics, "badgeId" | "updatedAt"> & {
          badge_id: string;
          updated_at?: string;
        };
        Update: Partial<Omit<BadgeAnalytics, "badgeId" | "updatedAt">> & {
          badge_id?: string;
          updated_at?: string;
        };
      };
      badge_shares: {
        Row: Omit<BadgeShare, "userId" | "badgeId"> & {
          user_id: string;
          badge_id: string;
        };
        Insert: Omit<BadgeShare, "userId" | "badgeId" | "createdAt"> & {
          user_id: string;
          badge_id: string;
          created_at?: string;
        };
        Update: Partial<
          Omit<BadgeShare, "userId" | "badgeId" | "createdAt">
        > & {
          user_id?: string;
          badge_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      leaderboard_view: {
        Row: {
          user_id: string;
          name: string;
          email: string;
          avatar_url: string | null;
          participation_count: number;
          badge_count: number;
          nft_count: number;
          applicant_count: number;
          created_at: string;
        };
      };
    };
    Functions: {
      get_leaderboard: {
        Args: {
          timeframe: string;
          category: string;
          limit_val: number;
          offset_val: number;
          search_term: string;
        };
        Returns: {
          user_id: string;
          name: string;
          email: string;
          avatar_url: string | null;
          participation_count: number;
          badge_count: number;
          nft_count: number;
          applicant_count: number;
          rank: number;
          created_at: string;
        }[];
      };
    };
    Enums: {
      badge_type: BadgeType;
    };
  };
}
