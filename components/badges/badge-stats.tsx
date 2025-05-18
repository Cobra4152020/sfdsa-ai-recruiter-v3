import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BadgeWithProgress, BadgeType } from '@/types/badge'
import { useEnhancedBadges } from '@/hooks/use-enhanced-badges'
import { Skeleton } from '@/components/ui/skeleton'

interface BadgeStatsProps {
  userId?: string
  showPersonal?: boolean
}

interface StatCard {
  title: string
  value: number | string
  description: string
  trend?: number
}

export function BadgeStats({
  userId,
  showPersonal = true
}: BadgeStatsProps) {
  const { collections, userXP, isLoading, error } = useEnhancedBadges()

  const stats = useMemo(() => {
    if (!collections) return []

    const allBadges = collections.flatMap(c => c.badges) as BadgeWithProgress[]
    const earnedBadges = allBadges.filter(b => b.isUnlocked)
    const totalPoints = earnedBadges.reduce((sum, b) => sum + b.points, 0)
    
    const badgesByType = allBadges.reduce((acc, badge) => {
      acc[badge.type] = (acc[badge.type] || 0) + 1
      return acc
    }, {} as Record<BadgeType, number>)

    const cards: StatCard[] = [
      {
        title: 'Total Badges',
        value: allBadges.length,
        description: 'Total badges available',
      },
      {
        title: 'Badges Earned',
        value: earnedBadges.length,
        description: `${Math.round((earnedBadges.length / allBadges.length) * 100)}% completion rate`,
        trend: 5 // Example trend, should be calculated from analytics
      },
      {
        title: 'Total Points',
        value: totalPoints,
        description: 'Points from earned badges',
        trend: 12 // Example trend
      },
      {
        title: 'Most Common Type',
        value: Object.entries(badgesByType).sort((a, b) => b[1] - a[1])[0][0],
        description: `${Math.max(...Object.values(badgesByType))} badges of this type`
      }
    ]

    if (showPersonal && userXP) {
      cards.push(
        {
          title: 'Current Level',
          value: userXP.currentLevel,
          description: `${userXP.streakCount} day streak`
        },
        {
          title: 'XP Progress',
          value: `${userXP.totalXp} XP`,
          description: 'Total experience points earned'
        }
      )
    }

    return cards
  }, [collections, userXP, showPersonal])

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load badge statistics. Please try again.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 bg-white rounded-xl shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            {stat.trend && (
              <span className={`ml-2 text-sm font-medium ${
                stat.trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
        </motion.div>
      ))}
    </div>
  )
} 