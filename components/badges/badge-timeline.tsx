import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BadgeWithProgress, TimelineEvent } from '@/types/badge'
import { useEnhancedBadges } from '@/hooks/use-enhanced-badges'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from "@/components/ui/card"
import { Circle, CheckCircle2, Star, Clock, Target, Flag } from "lucide-react"

interface BadgeTimelineProps {
  userId?: string
  limit?: number
}

interface EnhancedTimelineEvent extends TimelineEvent {
  badge?: BadgeWithProgress
}

export function BadgeTimeline({
  userId,
  limit = 10
}: BadgeTimelineProps) {
  const { collections, isLoading, error } = useEnhancedBadges()
  
  const events = useMemo(() => {
    if (!collections) return []

    const allBadges = collections.flatMap(c => c.badges) as BadgeWithProgress[]
    const badgeMap = new Map(allBadges.map(b => [b.id, b]))

    // Generate events based on badge progress
    const generatedEvents: TimelineEvent[] = allBadges
      .filter(badge => badge.progress > 0 || badge.earned)
      .flatMap(badge => {
        const events: TimelineEvent[] = []
        
        // Start event when progress is initiated
        if (badge.progress > 0) {
          events.push({
            id: Date.now() + Math.random(),
            date: badge.lastUpdated || new Date().toISOString(),
            event: `Started working on ${badge.name}`,
            type: "start",
            badgeId: badge.id,
            userId: userId || "unknown"
          })
        }

        // Progress event at 50%
        if (badge.progress >= 50 && !badge.earned) {
          events.push({
            id: Date.now() + Math.random(),
            date: badge.lastUpdated || new Date().toISOString(),
            event: `Reached 50% progress on ${badge.name}`,
            type: "progress",
            badgeId: badge.id,
            userId: userId || "unknown"
          })
        }

        // Milestone event at 75%
        if (badge.progress >= 75 && !badge.earned) {
          events.push({
            id: Date.now() + Math.random(),
            date: badge.lastUpdated || new Date().toISOString(),
            event: `Almost completed ${badge.name}`,
            type: "milestone",
            badgeId: badge.id,
            userId: userId || "unknown"
          })
        }

        // Completion event when earned
        if (badge.earned) {
          events.push({
            id: Date.now() + Math.random(),
            date: badge.lastUpdated || new Date().toISOString(),
            event: `Earned the ${badge.name} badge!`,
            type: "completion",
            badgeId: badge.id,
            userId: userId || "unknown"
          })
        }

        return events
      })

    return generatedEvents
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
      .map((event): EnhancedTimelineEvent => ({
        ...event,
        badge: badgeMap.get(event.badgeId)
      }))
  }, [collections, limit, userId])

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "start":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "progress":
        return <Target className="h-4 w-4 text-orange-500" />
      case "milestone":
        return <Flag className="h-4 w-4 text-purple-500" />
      case "completion":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "unlock":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "share":
        return <Circle className="h-4 w-4 text-pink-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load badge timeline. Please try again.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No badge activity found.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-3"
        >
          <div className="flex flex-col items-center">
            <div className="h-8 flex items-center">{getEventIcon(event.type)}</div>
            {event.id !== events[events.length - 1].id && (
              <div className="w-px h-full bg-gray-200" />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-900">{event.event}</p>
            <time className="text-xs text-gray-500">
              {format(new Date(event.date), "MMM d, yyyy")}
            </time>
            {event.badge && (
              <div className="mt-1 text-xs text-gray-600">
                {event.badge.rarity} • {event.badge.points} points
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
} 