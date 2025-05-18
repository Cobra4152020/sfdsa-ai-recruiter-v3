import { Clock } from "lucide-react"
import type { TimelineEvent } from "@/types/badge"
import { useState, useEffect } from "react"

interface BadgeTimelineProps {
  badgeId: string
}

export function BadgeTimeline({ badgeId }: BadgeTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // This is a placeholder. In a real application, you would fetch
    // actual timeline data from your backend
    const fetchEvents = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setEvents([
          {
            id: 1,
            date: "2024-05-15",
            event: "Started progress towards badge",
            type: "start",
            badgeId,
            userId: "placeholder-user-id",
          },
          {
            id: 2,
            date: "2024-05-16",
            event: "Completed first requirement",
            type: "progress",
            badgeId,
            userId: "placeholder-user-id",
          },
          {
            id: 3,
            date: "2024-05-17",
            event: "Halfway to completion",
            type: "milestone",
            badgeId,
            userId: "placeholder-user-id",
          },
        ])
      } catch (error) {
        console.error("Error fetching timeline events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [badgeId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-3 animate-pulse">
            <div className="h-5 w-5 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <time className="text-sm text-gray-500">{event.date}</time>
            <p className="text-gray-700">{event.event}</p>
          </div>
        </div>
      ))}
    </div>
  )
} 