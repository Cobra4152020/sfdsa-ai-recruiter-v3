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

interface UseEnhancedBadgesOptions {
  onLevelUp?: (newLevel: number, rewards: any) => void
  onStreakUpdate?: (streak: number, maintained: boolean) => void
  onChallengeComplete?: (challengeId: string) => void
  onBadgeUnlock?: (badgeId: string) => void
}

export function useEnhancedBadges(options: UseEnhancedBadgesOptions = {}) {
  const { currentUser } = useUser()
  const { toast } = useToast()
  
  // State
  const [collections, setCollections] = useState<BadgeCollection[]>([])
  const [userXP, setUserXP] = useState<UserXP | null>(null)
  const [activeChallenges, setActiveChallenges] = useState<BadgeChallenge[]>([])
  const [showcaseSettings, setShowcaseSettings] = useState<BadgeShowcaseSettings | null>(null)
  const [preferences, setPreferences] = useState<UserBadgePreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    if (!currentUser?.id) return

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [
          collectionsData,
          xpData,
          challengesData,
          showcaseData,
          preferencesData,
        ] = await Promise.all([
          getBadgeCollections(),
          getUserXP(currentUser.id),
          getActiveChallenges(),
          getBadgeShowcaseSettings(currentUser.id),
          getUserBadgePreferences(currentUser.id),
        ])

        // Validate collections data
        if (!Array.isArray(collectionsData)) {
          console.warn('Invalid collections data format, initializing empty array')
          setCollections([])
          return
        }

        // Ensure each collection has required properties and initialize with defaults if needed
        const validCollections = collectionsData
          .filter(collection => collection && typeof collection === 'object')
          .map(collection => ({
            id: collection.id || '',
            name: collection.name || 'Untitled Collection',
            description: collection.description || '',
            theme: collection.theme || 'default',
            specialReward: collection.special_reward || null,
            badges: Array.isArray(collection.badges) 
              ? collection.badges
                  .filter((b: any) => b && b.badge && typeof b.badge === 'object')
                  .map((b: any) => ({
                    ...b.badge,
                    earned: false,
                    progress: 0,
                    status: 'locked',
                    lastUpdated: new Date().toISOString()
                  }))
              : [],
            progress: 0,
            isComplete: false,
          }))

        setCollections(validCollections)
        setUserXP(xpData)
        setActiveChallenges(challengesData)
        setShowcaseSettings(showcaseData)
        setPreferences(preferencesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load badge data')
        toast({
          title: 'Error',
          description: 'Failed to load badge data. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [currentUser?.id, toast])

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

  return {
    // Data
    collections,
    userXP,
    activeChallenges,
    showcaseSettings,
    preferences,
    isLoading,
    error,

    // Actions
    addXP,
    updateChallenge,
    updateShowcase,
    updatePreferences,
  }
} 