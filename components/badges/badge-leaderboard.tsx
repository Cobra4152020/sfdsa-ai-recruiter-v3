import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BadgeWithProgress, UserXP } from '@/types/badge'
import { useEnhancedBadges } from '@/hooks/use-enhanced-badges'
import { Skeleton } from '@/components/ui/skeleton'

interface LeaderboardEntry {
  userId: string
  username: string
  totalXp: number
  badgesEarned: number
  recentBadges: BadgeWithProgress[]
}

interface BadgeLeaderboardProps {
  limit?: number
  timeframe?: 'all' | 'month' | 'week' | 'day'
}

export function BadgeLeaderboard({ 
  limit = 10,
  timeframe = 'all' 
}: BadgeLeaderboardProps) {
  const [sortBy, setSortBy] = useState<'xp' | 'badges'>('xp')
  const { collections, userXP, isLoading, error } = useEnhancedBadges()

  const leaderboardData = useMemo(() => {
    if (!collections || !userXP) return []

    const entries: LeaderboardEntry[] = Object.entries(userXP).map(([userId, xpData]: [string, UserXP]) => ({
      userId,
      username: userId, // TODO: Replace with actual username lookup
      totalXp: xpData.totalXp,
      badgesEarned: collections.reduce((count, collection) => 
        count + collection.badges.filter(b => (b as BadgeWithProgress).isUnlocked).length, 0
      ),
      recentBadges: collections
        .flatMap(c => c.badges)
        .filter(b => (b as BadgeWithProgress).isUnlocked)
        .slice(0, 3) as BadgeWithProgress[]
    }))

    return entries.sort((a, b) => 
      sortBy === 'xp' 
        ? b.totalXp - a.totalXp
        : b.badgesEarned - a.badgesEarned
    ).slice(0, limit)
  }, [collections, userXP, sortBy, limit])

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load leaderboard data. Please try again.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('xp')}
            className={`px-4 py-2 rounded-lg ${
              sortBy === 'xp' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            XP
          </button>
          <button
            onClick={() => setSortBy('badges')}
            className={`px-4 py-2 rounded-lg ${
              sortBy === 'badges' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Badges
          </button>
        </div>
      </div>

      <AnimatePresence>
        <div className="space-y-4">
          {leaderboardData.map((entry, index) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold text-lg">
                {index + 1}
              </div>
              
              <div className="flex-grow">
                <h3 className="font-medium">{entry.username}</h3>
                <div className="flex gap-2 text-sm text-gray-500">
                  <span>{entry.totalXp} XP</span>
                  <span>•</span>
                  <span>{entry.badgesEarned} Badges</span>
                </div>
              </div>

              <div className="flex gap-2">
                {entry.recentBadges.map(badge => (
                  <div 
                    key={badge.id}
                    className="w-8 h-8 rounded-full bg-gray-100"
                    style={{ backgroundImage: `url(${badge.imageUrl})` }}
                    title={badge.name}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
} 