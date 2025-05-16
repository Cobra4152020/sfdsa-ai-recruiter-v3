"use client"

import { useState, useEffect } from "react"
import { JourneyPerformanceDashboard } from "@/components/journey-performance-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function JourneyPerformancePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch journey performance data from API
        const response = await fetch('/api/admin/journey-performance')
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Error fetching journey performance data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <Skeleton className="w-full h-[500px]" />
  }

  return <JourneyPerformanceDashboard data={data} />
}
