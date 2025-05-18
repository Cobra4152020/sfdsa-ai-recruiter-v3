import { useMemo } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/types/badge"
import { useEnhancedBadges } from "@/hooks/use-enhanced-badges"
import { AchievementBadge } from "@/components/achievement-badge"
import { Skeleton } from "@/components/ui/skeleton"

interface BadgeGridProps {
  userId?: string
  searchQuery: string
  filters: {
    category: string
    difficulty: string
    status: string
  }
  status?: "earned" | "progress" | "locked"
  showAll?: boolean
}

export function BadgeGrid({
  userId,
  searchQuery,
  filters,
  status,
  showAll = false,
}: BadgeGridProps) {
  const { collections, isLoading, error } = useEnhancedBadges()

  const filteredBadges = useMemo(() => {
    if (!collections) return []

    // Flatten all badges from collections
    let badges = collections.flatMap(c => c.badges)

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      badges = badges.filter(badge => 
        badge.name.toLowerCase().includes(query) ||
        badge.description.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (filters.category !== "all") {
      badges = badges.filter(badge => badge.type === filters.category)
    }

    // Apply difficulty filter
    if (filters.difficulty !== "all") {
      badges = badges.filter(badge => badge.rarity === filters.difficulty)
    }

    // Apply status filter if not showing all
    if (!showAll && status) {
      badges = badges.filter(badge => {
        switch (status) {
          case "earned":
            return badge.isUnlocked
          case "progress":
            return !badge.isUnlocked && badge.progress > 0
          case "locked":
            return !badge.isUnlocked && badge.progress === 0
          default:
            return true
        }
      })
    }

    return badges
  }, [collections, searchQuery, filters, status, showAll])

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load badges. Please try again.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-24 w-24 rounded-lg" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (filteredBadges.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No badges found matching your criteria.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {filteredBadges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center text-center"
        >
          <AchievementBadge
            type={badge.type}
            rarity={badge.rarity}
            points={badge.points}
            earned={badge.isUnlocked}
            progress={badge.progress}
            size="lg"
          />
          <h3 className="mt-2 font-medium text-sm">{badge.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{badge.points} points</p>
        </motion.div>
      ))}
    </div>
  )
} 