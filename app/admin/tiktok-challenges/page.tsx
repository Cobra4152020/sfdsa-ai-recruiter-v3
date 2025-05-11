"use client"

import { useState, useEffect } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TikTokChallengeForm } from "@/components/admin/tiktok-challenge-form"
import { TikTokChallengeList } from "@/components/admin/tiktok-challenge-list"
import { TikTokSubmissionReview } from "@/components/admin/tiktok-submission-review"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw, Award } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function TikTokChallengesAdminPage() {
  const [activeTab, setActiveTab] = useState("challenges")
  const [isCreating, setIsCreating] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    fetchPendingSubmissionsCount()
  }, [])

  const fetchPendingSubmissionsCount = async () => {
    try {
      const response = await fetch("/api/tiktok-challenges/submissions?status=pending&countOnly=true")
      if (response.ok) {
        const data = await response.json()
        setPendingCount(data.count || 0)
      }
    } catch (error) {
      console.error("Error fetching pending submissions count:", error)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchPendingSubmissionsCount()
      toast({
        title: "Refreshed",
        description: "The data has been refreshed successfully.",
      })
    } catch (error) {
      console.error("Error refreshing data:", error)
      toast({
        title: "Refresh failed",
        description: "There was an error refreshing the data.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <PageWrapper>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">TikTok Challenges Admin</h1>
            <p className="text-gray-600 mt-1">Manage TikTok challenges and review submissions</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            {!isCreating && (
              <Button
                onClick={() => {
                  setIsCreating(true)
                  setActiveTab("create")
                }}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                New Challenge
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="challenges">All Challenges</TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-1">
              Submissions
              {pendingCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="create">Create Challenge</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges">
            <TikTokChallengeList />
          </TabsContent>

          <TabsContent value="submissions">
            <TikTokSubmissionReview onReviewComplete={fetchPendingSubmissionsCount} />
          </TabsContent>

          <TabsContent value="create">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Create New TikTok Challenge</h2>
              </div>
              <TikTokChallengeForm
                onSuccess={() => {
                  setIsCreating(false)
                  setActiveTab("challenges")
                  toast({
                    title: "Challenge created",
                    description: "The TikTok challenge has been created successfully.",
                  })
                }}
                onCancel={() => {
                  setIsCreating(false)
                  setActiveTab("challenges")
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  )
}
