"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Calendar, Clock } from "lucide-react"
import { BriefingShareDialog } from "./briefing-share-dialog"
import { BriefingStreakBadge } from "./briefing-streak-badge"
import { useUser } from "@/context/user-context"
import { useToast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"
import { format } from "date-fns"

interface BriefingCardProps {
  briefing: {
    id: string
    title: string
    content: string
    date: string
    theme: string
    created_at: string
    updated_at: string
  }
}

export function BriefingCard({ briefing }: BriefingCardProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const { isLoggedIn } = useUser()
  const { toast } = useToast()

  // Safely format the date
  const formattedDate = (() => {
    try {
      return format(new Date(briefing.date), "MMMM d, yyyy")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Today"
    }
  })()

  // Handle share button click
  const handleShare = () => {
    if (isLoggedIn) {
      setShowShareDialog(true)
    } else {
      toast({
        title: "Login Required",
        description: "Please log in to share the daily briefing.",
        variant: "default",
      })
    }
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{briefing.title || "Daily Briefing"}</CardTitle>
            <Badge variant="outline" className="ml-2">
              {briefing.theme || "General"}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
            <Clock className="h-4 w-4 ml-4 mr-1" />
            <span>
              {(() => {
                try {
                  return format(new Date(briefing.created_at), "h:mm a")
                } catch (error) {
                  return "Updated recently"
                }
              })()}
            </span>
          </div>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          {briefing.content ? (
            <ReactMarkdown>{briefing.content}</ReactMarkdown>
          ) : (
            <p>No briefing content available for today. Please check back later.</p>
          )}
        </CardContent>
        <CardFooter className="pt-3 flex justify-between">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Briefing
          </Button>
          {isLoggedIn && <BriefingStreakBadge />}
        </CardFooter>
      </Card>

      <BriefingShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        briefingId={briefing.id}
        briefingTitle={briefing.title}
      />
    </>
  )
}
