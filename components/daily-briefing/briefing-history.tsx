"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeIcon, getThemeColor, getThemeTitle } from "./theme-icon"
import { History, Calendar } from "lucide-react"
import type { DailyBriefing } from "@/lib/daily-briefing-service"

export function BriefingHistory() {
  const [briefings, setBriefings] = useState<DailyBriefing[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBriefing, setSelectedBriefing] = useState<DailyBriefing | null>(null)

  useEffect(() => {
    fetchBriefings()
  }, [])

  // Select the first briefing as default when they load
  useEffect(() => {
    if (briefings.length > 0 && !selectedBriefing) {
      setSelectedBriefing(briefings[0])
    }
  }, [briefings, selectedBriefing])

  const fetchBriefings = async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/daily-briefing/history?limit=7")

      if (!response.ok) {
        throw new Error(`Failed to fetch briefing history: ${response.statusText}`)
      }

      const data = await response.json()
      setBriefings(data.briefings || [])
    } catch (error) {
      console.error("Error fetching briefing history:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-72" />
        </CardContent>
      </Card>
    )
  }

  if (briefings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No previous briefings found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-[#0A3C1F]" />
          Previous Briefings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue={briefings[0].id}>
          <TabsList className="grid grid-cols-7 h-auto">
            {briefings.map((briefing) => (
              <TabsTrigger
                key={briefing.id}
                value={briefing.id}
                onClick={() => setSelectedBriefing(briefing)}
                className="flex flex-col py-2 h-auto text-xs"
              >
                <Calendar className="h-4 w-4 mb-1" />
                {formatDate(briefing.date)}
              </TabsTrigger>
            ))}
          </TabsList>

          {briefings.map((briefing) => (
            <TabsContent key={briefing.id} value={briefing.id} className="mt-4">
              {selectedBriefing && selectedBriefing.id === briefing.id && (
                <BriefingHistoryItem briefing={selectedBriefing} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface BriefingHistoryItemProps {
  briefing: DailyBriefing
}

function BriefingHistoryItem({ briefing }: BriefingHistoryItemProps) {
  const themeColors = getThemeColor(briefing.theme)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ThemeIcon theme={briefing.theme} className={themeColors.text} />
          <Badge variant="outline" className={`${themeColors.bg} ${themeColors.text} border-none`}>
            {getThemeTitle(briefing.theme)}
          </Badge>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(briefing.date).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Quote section */}
      <div className="border-l-4 border-gray-300 pl-4 italic">
        <p className="text-lg font-serif mb-2">{briefing.quote}</p>
        {briefing.quote_author && <p className="text-right text-gray-600">— {briefing.quote_author}</p>}
      </div>

      {/* Sgt. Ken's Take */}
      <div className={`p-4 rounded-md ${themeColors.bg} border ${themeColors.border}`}>
        <div className="font-bold mb-2">Sgt. Ken's Take:</div>
        <p className="text-gray-800 dark:text-gray-200">{briefing.sgt_ken_take}</p>
      </div>

      {/* Call to Action */}
      <div className="bg-[#0A3C1F]/10 p-4 rounded-md">
        <p className="font-bold text-[#0A3C1F] mb-2">Call to Action:</p>
        <p className="text-gray-800 dark:text-gray-200">{briefing.call_to_action}</p>
      </div>
    </div>
  )
}
