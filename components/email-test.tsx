"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export function EmailTest() {
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("welcome")
  const { toast } = useToast()

  // Badge notification state
  const [badgeName, setBadgeName] = useState("Chat Participation")
  const [badgeDescription, setBadgeDescription] = useState(
    "Awarded for actively participating in conversations with Sgt. Ken.",
  )
  const [badgeShareMessage, setBadgeShareMessage] = useState(
    "Keep up the great work on your journey to joining the SF Sheriff's Office!",
  )

  // NFT notification state
  const [nftAwardId, setNftAwardId] = useState("bronze")

  // Application status state
  const [statusUpdate, setStatusUpdate] = useState("Your application has been received and is currently under review.")
  const [nextSteps, setNextSteps] = useState(
    "Complete the written test\nSchedule your physical fitness assessment\nPrepare for the oral interview",
  )

  const handleSendEmail = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      let endpoint = ""
      let payload = {}

      switch (activeTab) {
        case "welcome":
          endpoint = "/api/send-welcome-email"
          payload = { userId }
          break
        case "badge":
          endpoint = "/api/send-badge-notification"
          payload = { userId, badgeName, badgeDescription, badgeShareMessage }
          break
        case "nft":
          endpoint = "/api/send-nft-notification"
          payload = { userId, nftAwardId }
          break
        case "application":
          endpoint = "/api/send-application-status"
          payload = {
            userId,
            statusUpdate,
            nextSteps: nextSteps.split("\n").filter((step) => step.trim() !== ""),
          }
          break
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Email sent successfully! Message ID: ${data.messageId}`,
        })
      } else {
        throw new Error(data.message || "Failed to send email")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Email Testing Tool</CardTitle>
        <CardDescription>Test the email functionality using Resend</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Enter user ID" />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="welcome">Welcome</TabsTrigger>
              <TabsTrigger value="badge">Badge</TabsTrigger>
              <TabsTrigger value="nft">NFT Award</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
            </TabsList>

            <TabsContent value="welcome" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Send a welcome email to the user with information about the platform and how to get started.
              </p>
            </TabsContent>

            <TabsContent value="badge" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="badgeName">Badge Name</Label>
                <Input
                  id="badgeName"
                  value={badgeName}
                  onChange={(e) => setBadgeName(e.target.value)}
                  placeholder="Enter badge name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="badgeDescription">Badge Description</Label>
                <Textarea
                  id="badgeDescription"
                  value={badgeDescription}
                  onChange={(e) => setBadgeDescription(e.target.value)}
                  placeholder="Enter badge description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="badgeShareMessage">Share Message (Optional)</Label>
                <Textarea
                  id="badgeShareMessage"
                  value={badgeShareMessage}
                  onChange={(e) => setBadgeShareMessage(e.target.value)}
                  placeholder="Enter share message"
                />
              </div>
            </TabsContent>

            <TabsContent value="nft" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nftAwardId">NFT Award ID</Label>
                <select
                  id="nftAwardId"
                  value={nftAwardId}
                  onChange={(e) => setNftAwardId(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="bronze">Bronze Recruit</option>
                  <option value="silver">Silver Recruit</option>
                  <option value="gold">Gold Recruit</option>
                  <option value="platinum">Platinum Recruit</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="application" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="statusUpdate">Status Update</Label>
                <Textarea
                  id="statusUpdate"
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  placeholder="Enter status update"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextSteps">Next Steps (One per line)</Label>
                <Textarea
                  id="nextSteps"
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="Enter next steps (one per line)"
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSendEmail} disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send Test Email"}
        </Button>
      </CardFooter>
    </Card>
  )
}
