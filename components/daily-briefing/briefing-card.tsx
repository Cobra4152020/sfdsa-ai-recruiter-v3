"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BriefingShareDialog } from "./briefing-share-dialog"
import { BriefingStreakBadge } from "./briefing-streak-badge"
import { useRouter } from "next/navigation"

interface BriefingCardProps {
  briefing: any
}

export function BriefingCard({ briefing }: BriefingCardProps) {
  const [isAttended, setIsAttended] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const router = useRouter()

  const handleAttend = async () => {
    if (isAttended) return

    try {
      const response = await fetch("/api/daily-briefing/attend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ briefingId: briefing?.id }),
      })

      if (response.ok) {
        setIsAttended(true)
        router.refresh()
      }
    } catch (error) {
      console.error("Error marking attendance:", error)
    }
  }

  if (!briefing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>No Briefing Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There is no briefing scheduled for today. Please check back later.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{briefing.title}</CardTitle>
          <BriefingStreakBadge streak={briefing.userStreak || 0} />
        </div>
        <p className="text-sm text-gray-500">
          {new Date(briefing.date).toLocaleDateString()} • {briefing.location || "Department HQ"}
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: briefing.content }} />

        {briefing.keyPoints && briefing.keyPoints.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Key Points:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {briefing.keyPoints.map((point: string, index: number) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button onClick={handleAttend} disabled={isAttended} variant={isAttended ? "outline" : "default"}>
          {isAttended ? "Attended ✓" : "Mark as Attended"}
        </Button>
        <Button variant="outline" onClick={() => setIsShareOpen(true)}>
          Share Briefing
        </Button>
      </CardFooter>

      <BriefingShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        briefingId={briefing.id}
        briefingTitle={briefing.title}
      />
    </Card>
  )
}
