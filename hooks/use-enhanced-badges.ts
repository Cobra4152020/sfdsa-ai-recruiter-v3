"use client"

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useUser } from '@/context/user-context'
import {
  getBadgeCollections,
  getBadgeTiers,
  getUserXP,
  getActiveChallenges,
  getUserChallengeProgress,
  getBadgeShowcaseSettings,
  getBadgeAnalytics,
  getBadgeRewards,
  getUserBadgePreferences,
  updateUserXP,
  updateChallengeProgress,
  updateShowcaseSettings,
  updateBadgePreferences,
} from '@/lib/api/enhanced-badges'
import type {
  Badge,
  BadgeCollection,
  BadgeTier,
  UserXP,
  BadgeChallenge,
  UserChallengeProgress,
  BadgeShowcaseSettings,
  BadgeAnalytics,
  BadgeReward,
  UserBadgePreferences,
  BadgeLayoutType,
  BadgeDisplayStyle,
} from '@/types/badge'
import { supabase } from '@/lib/supabase'

interface BadgeCollectionMembership {
  badge: Badge | null
}

interface RawBadgeCollection extends Omit<BadgeCollection, 'badges'> {
  badges?: BadgeCollectionMembership[]
}

interface UseEnhancedBadgesOptions {
  onLevelUp?: (newLevel: number, rewards: any) => void
  onStreakUpdate?: (streak: number, maintained: boolean) => void
  onChallengeComplete?: (challengeId: string) => void
  onBadgeUnlock?: (badgeId: string) => void
}

interface UseEnhancedBadgesResult {
  collections: BadgeCollection[]
  userXP: UserXP | null
  activeChallenges: BadgeChallenge[]
  showcaseSettings: BadgeShowcaseSettings | null
  preferences: UserBadgePreferences | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

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
      "Review feedback"
    ],
    rewards: [
      "Access to advanced study materials",
      "Test-taking tips",
      "Practice test feedback"
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
      "Review feedback"
    ],
    rewards: [
      "Mock interview access",
      "Interview tips",
      "Sample answers"
    ],
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
      "Pass practice test"
    ],
    rewards: [
      "Training program access",
      "Fitness tips",
      "Progress tracking"
    ],
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
      "Watch preparation video"
    ],
    rewards: [
      "Detailed guide access",
      "Sample questions",
      "Expert tips"
    ],
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
      "Watch preparation video"
    ],
    rewards: [
      "Detailed guide access",
      "Sample questions",
      "Expert tips"
    ],
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
      "Attend orientation"
    ],
    rewards: [
      "Special recognition",
      "Priority support",
      "Exclusive content"
    ],
    imageUrl: "/placeholder.svg?key=h7vzt",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

// Define default collections
const DEFAULT_COLLECTIONS: BadgeCollection[] = [
  {
    id: "application",
    name: "Application Process",
    description: "Badges earned during the application process",
    badges: ALL_BADGES.filter(badge => ["written", "oral", "physical", "polygraph", "psychological", "full"].includes(badge.id)),
    progress: 0,
    isComplete: false,
    specialReward: "Priority Application Status",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

export function useEnhancedBadges(options: UseEnhancedBadgesOptions = {}): UseEnhancedBadgesResult {
  const { currentUser } = useUser()
  const { toast } = useToast()
  
  // State
  const [collections, setCollections] = useState<BadgeCollection[]>(DEFAULT_COLLECTIONS)
  const [userXP, setUserXP] = useState<UserXP | null>(null)
  const [activeChallenges, setActiveChallenges] = useState<BadgeChallenge[]>([])
  const [showcaseSettings, setShowcaseSettings] = useState<BadgeShowcaseSettings | null>(null)
  const [preferences, setPreferences] = useState<UserBadgePreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load badge collections with error handling
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('badge_collections')
        .select(`
          *,
          badges:badge_collection_memberships(
            badge:badges(*)
          )
        `)
        .order('created_at', { ascending: false })

      if (collectionsError) {
        console.error('Error loading collections:', collectionsError)
        // Keep using DEFAULT_COLLECTIONS that were set in useState
      } else if (!Array.isArray(collectionsData) || collectionsData.length === 0) {
        console.warn('No collections found, using default collections')
        // Keep using DEFAULT_COLLECTIONS that were set in useState
      } else {
        try {
          // Transform the data to match the expected format
          const transformedCollections = collectionsData.map(collection => ({
            ...collection,
            badges: (collection.badges
              ?.map((membership: { badge: Badge | null }) => membership.badge)
              .filter((badge: Badge | null): badge is Badge => badge !== null) || [])
          }))
          
          // Only update collections if we have valid data
          if (Array.isArray(transformedCollections) && transformedCollections.length > 0) {
            setCollections(transformedCollections)
          }
        } catch (transformError) {
          console.error('Error transforming collections:', transformError)
          // Keep using DEFAULT_COLLECTIONS that were set in useState
        }
      }

      // Load user XP if userId is provided
      if (currentUser?.id) {
        const { data: xpData, error: xpError } = await supabase
          .from('user_xp')
          .select('*')
          .eq('user_id', currentUser.id)
          .single()

        if (xpError && xpError.code !== 'PGRST116') { // Ignore "not found" errors
          console.error('Error loading user XP:', xpError)
        } else {
          setUserXP(xpData || {
            userId: currentUser.id,
            totalXp: 0,
            currentLevel: 1,
            streakCount: 0
          })
        }

        // Load active challenges
        const now = new Date().toISOString()
        const { data: challengesData, error: challengesError } = await supabase
          .from('badge_challenges')
          .select('*')
          .eq('is_active', true)
          .gte('end_date', now)

        if (challengesError) {
          console.error('Error loading challenges:', challengesError)
          setActiveChallenges([])
        } else {
          setActiveChallenges(challengesData || [])
        }

        // Load showcase settings
        const { data: showcaseData, error: showcaseError } = await supabase
          .from('badge_showcase_settings')
          .select('*')
          .eq('user_id', currentUser.id)
          .single()

        if (showcaseError && showcaseError.code !== 'PGRST116') {
          console.error('Error loading showcase settings:', showcaseError)
        } else {
          setShowcaseSettings(showcaseData || {
            userId: currentUser.id,
            layoutType: 'grid',
            featuredBadges: [],
            showcaseTheme: 'default',
            isPublic: true
          })
        }

        // Load preferences
        const { data: preferencesData, error: preferencesError } = await supabase
          .from('user_badge_preferences')
          .select('*')
          .eq('user_id', currentUser.id)
          .single()

        if (preferencesError && preferencesError.code !== 'PGRST116') {
          console.error('Error loading preferences:', preferencesError)
        } else {
          setPreferences(preferencesData || {
            userId: currentUser.id,
            displayStyle: 'standard',
            notificationSettings: { email: true, push: true },
            pinnedBadges: [],
            customGoals: null
          })
        }
      }
    } catch (err) {
      console.error('Error in useEnhancedBadges:', err)
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentUser?.id])

  // Handle XP updates
  const addXP = useCallback(async (amount: number) => {
    if (!currentUser?.id) return

    try {
      await updateUserXP(currentUser.id, amount)
      const newXP = await getUserXP(currentUser.id)
      setUserXP(newXP)

      if (newXP.currentLevel > (userXP?.currentLevel ?? 0)) {
        options.onLevelUp?.(newXP.currentLevel, []) // TODO: Pass actual rewards
        toast({
          title: 'Level Up!',
          description: `You've reached level ${newXP.currentLevel}!`,
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update XP. Please try again.',
        variant: 'destructive',
      })
    }
  }, [currentUser?.id, userXP?.currentLevel, options.onLevelUp, toast])

  // Handle challenge progress
  const updateChallenge = useCallback(async (
    challengeId: string,
    progress: Record<string, any>
  ) => {
    if (!currentUser?.id) return

    try {
      await updateChallengeProgress(currentUser.id, challengeId, progress)
      
      if (progress.completed) {
        options.onChallengeComplete?.(challengeId)
        toast({
          title: 'Challenge Complete!',
          description: "You've completed a badge challenge!",
        })
      }

      // Refresh challenges
      const updatedChallenges = await getActiveChallenges()
      setActiveChallenges(updatedChallenges)
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update challenge progress. Please try again.',
        variant: 'destructive',
      })
    }
  }, [currentUser?.id, options.onChallengeComplete, toast])

  // Handle showcase settings
  const updateShowcase = useCallback(async (
    settings: Partial<BadgeShowcaseSettings>
  ) => {
    if (!currentUser?.id) return

    try {
      await updateShowcaseSettings(currentUser.id, settings)
      const updatedSettings = await getBadgeShowcaseSettings(currentUser.id)
      setShowcaseSettings(updatedSettings)
      
      toast({
        title: 'Success',
        description: 'Badge showcase settings updated.',
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update showcase settings. Please try again.',
        variant: 'destructive',
      })
    }
  }, [currentUser?.id, toast])

  // Handle badge preferences
  const updatePreferences = useCallback(async (
    newPreferences: Partial<UserBadgePreferences>
  ) => {
    if (!currentUser?.id) return

    try {
      await updateBadgePreferences(currentUser.id, newPreferences)
      const updatedPreferences = await getUserBadgePreferences(currentUser.id)
      setPreferences(updatedPreferences)
      
      toast({
        title: 'Success',
        description: 'Badge preferences updated.',
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update preferences. Please try again.',
        variant: 'destructive',
      })
    }
  }, [currentUser?.id, toast])

  const refetch = async () => {
    await loadData()
  }

  return {
    collections,
    userXP,
    activeChallenges,
    showcaseSettings,
    preferences,
    isLoading,
    error,
    refetch
  }
} 