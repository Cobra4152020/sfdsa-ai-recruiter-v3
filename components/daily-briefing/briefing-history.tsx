"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ThemeIcon } from "./theme-icon"
import type { DailyBriefing } from "@/lib/daily-briefing-service"
import { formatDate } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export function BriefingHistory() {
  const [history, setHistory] = useState<DailyBriefing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/daily-briefing/history")

        if (!response.ok) {
          throw new Error("Failed to fetch briefing history")
        }

        const data = await response.json()
        setHistory(data.history || [])
      } catch (err) {
        console.error("Error fetching briefing history:", err)
        setError("Failed to load briefing history")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Previous Briefings</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Previous Briefings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Previous Briefings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">No previous briefings available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Previous Briefings</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {history.map((briefing) => (
            <AccordionItem key={briefing.id} value={briefing.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <ThemeIcon theme={briefing.theme} size={20} className="text-blue-600" />
                  <span className="font-medium capitalize">{briefing.theme} Briefing</span>
                  <span className="text-sm text-gray-500 ml-2">{formatDate(new Date(briefing.date))}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <blockquote className="text-gray-800 italic">"{briefing.quote}"</blockquote>
                    <div className="mt-1 text-right text-gray-600 text-sm">— {briefing.quote_author}</div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">Sgt. Ken's Take:</h4>
                    <p className="text-gray-600 text-sm mt-1">{briefing.sgt_ken_take}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
