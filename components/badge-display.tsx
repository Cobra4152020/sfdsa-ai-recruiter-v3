"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AchievementBadge } from "@/components/achievement-badge"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

export function BadgeDisplay() {
  const [activeTab, setActiveTab] = useState("all")

  const badges = [
    { type: "written", name: "Written Exam", description: "Awarded for completing the written examination." },
    { type: "oral", name: "Oral Interview", description: "Awarded for completing the oral interview." },
    { type: "physical", name: "Physical Test", description: "Awarded for passing the physical agility test." },
    { type: "polygraph", name: "Polygraph", description: "Awarded for completing the polygraph examination." },
    {
      type: "psychological",
      name: "Psychological",
      description: "Awarded for completing the psychological evaluation.",
    },
    { type: "full", name: "Full Process", description: "Awarded for completing the entire application process." },
    {
      type: "chat-participation",
      name: "Chat Participation",
      description: "Awarded for engaging with our AI assistant.",
    },
    {
      type: "application-started",
      name: "Application Started",
      description: "Awarded for starting the application process.",
    },
    {
      type: "first-response",
      name: "First Response",
      description: "Awarded for your first interaction with our platform.",
    },
    { type: "frequent-user", name: "Frequent User", description: "Awarded for regular engagement with our platform." },
    {
      type: "resource-downloader",
      name: "Resource Explorer",
      description: "Awarded for downloading recruitment resources.",
    },
    {
      type: "hard-charger",
      name: "Hard Charger",
      description: "Awarded for exceptional engagement with our platform.",
    },
  ]

  const categories = [
    { id: "all", name: "All Badges" },
    { id: "application", name: "Application" },
    { id: "engagement", name: "Engagement" },
    { id: "achievement", name: "Achievement" },
  ]

  const filteredBadges = badges.filter((badge) => {
    if (activeTab === "all") return true
    if (activeTab === "application")
      return ["written", "oral", "physical", "polygraph", "psychological", "full", "application-started"].includes(
        badge.type,
      )
    if (activeTab === "engagement")
      return ["chat-participation", "first-response", "frequent-user", "resource-downloader"].includes(badge.type)
    if (activeTab === "achievement") return ["hard-charger"].includes(badge.type)
    return true
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Available Badges
          <Button variant="ghost" size="sm" className="ml-2">
            <Info className="h-4 w-4" />
            <span className="sr-only">Badge Information</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredBadges.map((badge) => (
                <div key={badge.type} className="flex flex-col items-center text-center">
                  <AchievementBadge type={badge.type} size="lg" earned={false} />
                  <h3 className="mt-2 font-medium">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
