import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BadgeWithProgress, TimelineEvent } from '@/types/badge'
import { useEnhancedBadges } from '@/hooks/use-enhanced-badges'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from "@/components/ui/card"
import { Circle, CheckCircle2, Star } from "lucide-react"

interface BadgeTimelineProps {
  userId?: string
  limit?: number
  badgeId: string
}

interface EnhancedTimelineEvent extends TimelineEvent {
  badge?: BadgeWithProgress
}

export function BadgeTimeline({
  userId,
  limit = 10,
  badgeId
}: BadgeTimelineProps) {
  const { collections, isLoading, error } = useEnhancedBadges()
  
  // For demonstration, we'll create some sample timeline events
  const sampleTimelineEvents: TimelineEvent[] = [
    {
      id: 1,
      date: new Date().toISOString(),
      event: "Started working on badge",
      type: "start",
      badgeId: "sample-badge-1",
      userId: "user-1"
    },
    // Add more sample events as needed
  ]

  const events = useMemo(() => {
    if (!collections) return []

    const allBadges = collections.flatMap(c => c.badges) as BadgeWithProgress[]
    const badgeMap = new Map(allBadges.map(b => [b.id, b]))

    return sampleTimelineEvents
      .sort((a: TimelineEvent, b: TimelineEvent) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, limit)
      .map((event: TimelineEvent): EnhancedTimelineEvent => ({
        ...event,
        badge: badgeMap.get(event.badgeId)
      }))
  }, [collections, limit])

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "progress":
        return <Circle className="h-4 w-4 text-blue-500" />
      case "unlock":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "share":
        return <Star className="h-4 w-4 text-yellow-500" />
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
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-8 flex items-center">{getEventIcon(event.type)}</div>
            {event.id !== events[events.length - 1].id && (
              <div className="w-px h-full bg-gray-200" />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-900">{event.event}</p>
            <time className="text-xs text-gray-500">
              {new Date(event.date).toLocaleDateString()}
            </time>
          </div>
        </div>
      ))}
    </div>
  )
} 