"use client"

import { useState, useEffect } from "react"
import { AchievementBadge } from "./achievement-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Use the badge types from your AchievementBadge component
type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "application-started"
  | "application-completed"
  | "first-response"
  | "frequent-user"
  | "resource-downloader"

interface Badge {
  id: string
  badge_type: BadgeType
  name: string
  description: string
  created_at: string
}

export function BadgeShowcase() {
  const [category, setCategory] = useState<"all" | "application" | "participation">("all")
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBadges = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Try to fetch from API first
        const response = await fetch("/api/badges")
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch badges")
        }

        setBadges(data.badges)
      } catch (err) {
        console.error("Error fetching badges:", err)

        // Fallback to static data if API fails
        const staticBadges: Badge[] = [
          {
            id: "written",
            badge_type: "written",
            name: "Written Test",
            description: "Completed written test preparation",
            created_at: new Date().toISOString(),
          },
          {
            id: "oral",
            badge_type: "oral",
            name: "Oral Board",
            description: "Prepared for oral board interviews",
            created_at: new Date().toISOString(),
          },
          {
            id: "physical",
            badge_type: "physical",
            name: "Physical Test",
            description: "Completed physical test preparation",
            created_at: new Date().toISOString(),
          },
          {
            id: "polygraph",
            badge_type: "polygraph",
            name: "Polygraph",
            description: "Learned about the polygraph process",
            created_at: new Date().toISOString(),
          },
          {
            id: "psychological",
            badge_type: "psychological",
            name: "Psychological",
            description: "Prepared for psychological evaluation",
            created_at: new Date().toISOString(),
          },
          {
            id: "full",
            badge_type: "full",
            name: "Full Process",
            description: "Completed all preparation areas",
            created_at: new Date().toISOString(),
          },
          {
            id: "chat-participation",
            badge_type: "chat-participation",
            name: "Chat Participation",
            description: "Engaged with Sgt. Ken",
            created_at: new Date().toISOString(),
          },
          {
            id: "first-response",
            badge_type: "first-response",
            name: "First Response",
            description: "Received first response from Sgt. Ken",
            created_at: new Date().toISOString(),
          },
          {
            id: "application-started",
            badge_type: "application-started",
            name: "Application Started",
            description: "Started the application process",
            created_at: new Date().toISOString(),
          },
          {
            id: "application-completed",
            badge_type: "application-completed",
            name: "Application Completed",
            description: "Completed the application process",
            created_at: new Date().toISOString(),
          },
          {
            id: "frequent-user",
            badge_type: "frequent-user",
            name: "Frequent User",
            description: "Regularly engages with the recruitment platform",
            created_at: new Date().toISOString(),
          },
          {
            id: "resource-downloader",
            badge_type: "resource-downloader",
            name: "Resource Downloader",
            description: "Downloaded recruitment resources and materials",
            created_at: new Date().toISOString(),
          },
        ]

        setBadges(staticBadges)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBadges()
  }, [])

  const applicationBadgeTypes: BadgeType[] = [
    "written",
    "oral",
    "physical",
    "polygraph",
    "psychological",
    "full",
    "application-started",
    "application-completed",
  ]

  const filteredBadges = badges.filter((badge) => {
    if (category === "all") return true
    if (category === "application") return applicationBadgeTypes.includes(badge.badge_type)
    return !applicationBadgeTypes.includes(badge.badge_type)
  })

  return (
    <Card className="border border-[#0A3C1F]/20 dark:border-[#FFD700]/20">
      <CardHeader className="pb-2 bg-[#0A3C1F] text-white dark:bg-[#0A3C1F] dark:text-[#FFD700]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center">
            <span className="mr-2">🏅</span> Badge Legend
          </CardTitle>
          <Tabs defaultValue="all" value={category} onValueChange={(value) => setCategory(value as any)}>
            <TabsList>
              <TabsTrigger value="all">All Badges</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
              <TabsTrigger value="participation">Participation</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3C1F]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <>
            {category === "application" && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-[#0A3C1F] dark:text-[#FFD700]">Achievement Badges</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Earn these badges by completing specific milestones in your recruitment journey.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-4">
                  {filteredBadges
                    .filter((badge) =>
                      ["written", "oral", "physical", "polygraph", "psychological"].includes(badge.badge_type),
                    )
                    .map((badge) => (
                      <TooltipProvider key={badge.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center text-center p-2">
                              <AchievementBadge type={badge.badge_type} size="md" earned={false} />
                              <h3 className="font-medium mt-2 text-sm">{badge.name}</h3>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{badge.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
              </div>
            )}

            {(category === "all" || category === "application") && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-[#0A3C1F] dark:text-[#FFD700]">Process Badges</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Track your progress through the application process with these badges.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                  {filteredBadges
                    .filter((badge) =>
                      [
                        "chat-participation",
                        "first-response",
                        "application-started",
                        "application-completed",
                        "full",
                      ].includes(badge.badge_type),
                    )
                    .map((badge) => (
                      <TooltipProvider key={badge.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center text-center p-2">
                              <AchievementBadge type={badge.badge_type} size="md" earned={false} />
                              <h3 className="font-medium mt-2 text-sm">{badge.name}</h3>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{badge.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
              </div>
            )}

            {(category === "all" || category === "participation") && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#0A3C1F] dark:text-[#FFD700]">Participant Badges</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These badges recognize your engagement style and participation patterns.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {filteredBadges
                    .filter((badge) => ["frequent-user", "resource-downloader"].includes(badge.badge_type))
                    .map((badge) => (
                      <TooltipProvider key={badge.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center text-center p-2">
                              <AchievementBadge type={badge.badge_type} size="md" earned={false} />
                              <h3 className="font-medium mt-2 text-sm">{badge.name}</h3>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{badge.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
