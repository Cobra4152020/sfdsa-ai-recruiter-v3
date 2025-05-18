import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BadgeWithProgress, TimelineEvent } from '@/types/badge'
import { useEnhancedBadges } from '@/hooks/use-enhanced-badges'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

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
    <div className="space-y-8">
      {events.map((event: EnhancedTimelineEvent, index: number) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-8 pb-8 last:pb-0"
        >
          {/* Timeline line */}
          <div className="absolute left-[11px] top-2 bottom-0 w-0.5 bg-gray-200 last:hidden" />
          
          {/* Timeline dot */}
          <div className={`absolute left-0 top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            getEventStyles(event.type).dotClass
          }`}>
            {getEventStyles(event.type).icon}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {event.badge && (
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                {event.badge.imageUrl ? (
                  <img
                    src={event.badge.imageUrl}
                    alt={event.badge.name}
                    className="w-8 h-8"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                )}
              </div>
            )}

            <div className="flex-grow">
              <p className="text-sm text-gray-500">
                {format(new Date(event.date), 'MMM d, yyyy')}
              </p>
              <h3 className="font-medium mt-1">
                {event.badge?.name || 'Unknown Badge'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{event.event}</p>
            </div>

            {event.badge && (
              <div className="flex-shrink-0 text-right sm:ml-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {event.badge.points} points
                </span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function getEventStyles(type: TimelineEvent['type']) {
  switch (type) {
    case 'start':
      return {
        dotClass: 'bg-blue-50 border-blue-500',
        icon: '🎯'
      }
    case 'progress':
      return {
        dotClass: 'bg-yellow-50 border-yellow-500',
        icon: '📈'
      }
    case 'milestone':
      return {
        dotClass: 'bg-purple-50 border-purple-500',
        icon: '🏆'
      }
    case 'completion':
      return {
        dotClass: 'bg-green-50 border-green-500',
        icon: '✨'
      }
    default:
      return {
        dotClass: 'bg-gray-50 border-gray-500',
        icon: '•'
      }
  }
} 