"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Trophy, Medal, Award } from "lucide-react"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { EnhancementTracker } from "@/components/engagement-tracker"
import { BadgeDisplay } from "@/components/badge-display"
import { PointSystemExplanation } from "@/components/point-system-explanation"
import { useUser } from "@/context/user-context"
import { OptInForm } from "@/components/opt-in-form"
import { SkipToContent } from "@/components/skip-to-content"
import { useToast } from "@/components/ui/use-toast"
import { trackPageView } from "@/lib/analytics"
import { useRouter, useSearchParams } from "next/navigation"

export default function AwardsPage() {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const { isLoggedIn, currentUser } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get active tab from URL or default to 'leaderboard'
  const activeTab = searchParams.get("tab") || "leaderboard"

  // Track page view for analytics
  useEffect(() => {
    trackPageView("awards_page")
  }, [])

  const showOptInForm = (applying = false) => {
    setIsApplying(applying)
    setIsOptInFormOpen(true)
  }

  // Handle tab change and update URL
  const handleTabChange = (value) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", value)
    router.push(`/awards?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SkipToContent />
      <ImprovedHeader showOptInForm={() => showOptInForm(true)} />
      <main id="main-content" className="flex-1 pt-32 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 text-primary dark:text-primary-light">Top Recruit Awards</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Recognizing our most engaged candidates and top applicants. Engage with our AI assistant, learn about the
              application process, and join the ranks of those making a difference in San Francisco.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
                <TabsTrigger value="leaderboard" className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger value="badges" className="flex items-center">
                  <Medal className="h-4 w-4 mr-2" />
                  Badges
                </TabsTrigger>
                <TabsTrigger value="points" className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Points
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leaderboard">
                <EnhancementTracker
                  currentUserId={currentUser?.id}
                  showLoginPrompt={!isLoggedIn}
                  onLoginClick={() => showOptInForm(false)}
                />
              </TabsContent>

              <TabsContent value="badges">
                <div className="space-y-6">
                  <BadgeDisplay
                    userId={currentUser?.id}
                    isLoggedIn={isLoggedIn}
                    onLoginClick={() => showOptInForm(false)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="points">
                <PointSystemExplanation userId={currentUser?.id} isLoggedIn={isLoggedIn} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <ImprovedFooter />

      {/* Opt-in form dialog */}
      <OptInForm
        isOpen={isOptInFormOpen}
        onClose={() => {
          setIsOptInFormOpen(false)
          setIsApplying(false)
        }}
        isApplying={isApplying}
        returnUrl={`/awards?tab=${activeTab}`}
      />
    </div>
  )
}
