"use client"

import { useState } from "react"
import type { Badge } from "@/lib/badge-utils"
import { AchievementBadge } from "./achievement-badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Share2, Lock, CheckCircle, Trophy, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface BadgeDetailCardProps {
  badge: Badge
  earned?: boolean
  progress?: number
  currentUser?: { id: string; name: string } | null
  onShare?: () => void
}

export function BadgeDetailCard({ badge, earned = false, progress = 0, currentUser, onShare }: BadgeDetailCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md border border-[#0A3C1F]/20 dark:border-[#FFD700]/20">
      <CardHeader className="pb-2 bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/90 text-white dark:from-[#0A3C1F] dark:to-[#0A3C1F]/90 dark:text-[#FFD700]">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{badge.name}</CardTitle>
          {earned && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CheckCircle className="h-5 w-5 text-[#FFD700]" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>You've earned this badge!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardDescription className="text-white/80 dark:text-[#FFD700]/80">
          {badge.category === "application" ? "Application Achievement" : "Participation Recognition"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow py-4">
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <AchievementBadge type={badge.id as any} size="lg" earned={earned} />
            {!earned && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                <Lock className="h-6 w-6 text-white/90" />
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{badge.description}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Requirements:</span>
            {earned ? (
              <span className="text-green-600 dark:text-green-400 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> Completed
              </span>
            ) : (
              <span className="text-gray-500">{progress}% Complete</span>
            )}
          </div>

          <Progress value={earned ? 100 : progress} className="h-2 bg-gray-200" />

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 text-xs border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F]/10 dark:border-[#FFD700] dark:text-[#FFD700] dark:hover:bg-[#FFD700]/10"
              >
                <Info className="h-3.5 w-3.5 mr-1" /> View Requirements
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-[#0A3C1F] dark:text-[#FFD700]" />
                  {badge.name} Requirements
                </DialogTitle>
                <DialogDescription>Complete these requirements to earn this badge</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <AchievementBadge type={badge.id as any} size="sm" earned={earned} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{badge.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{badge.description}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-2">How to earn this badge:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {badge.id === "written" && (
                      <>
                        <li>Complete the written test preparation module</li>
                        <li>Score at least 80% on the practice test</li>
                        <li>Review all study materials</li>
                      </>
                    )}
                    {badge.id === "oral" && (
                      <>
                        <li>Complete the oral board interview preparation</li>
                        <li>Practice with at least 3 mock interview scenarios</li>
                        <li>Review all interview tips and techniques</li>
                      </>
                    )}
                    {badge.id === "physical" && (
                      <>
                        <li>Review the physical test requirements</li>
                        <li>Complete the training program outline</li>
                        <li>Track your progress on each physical test component</li>
                      </>
                    )}
                    {badge.id === "polygraph" && (
                      <>
                        <li>Learn about the polygraph process</li>
                        <li>Review common polygraph questions</li>
                        <li>Understand what to expect during the examination</li>
                      </>
                    )}
                    {badge.id === "psychological" && (
                      <>
                        <li>Complete the psychological evaluation preparation</li>
                        <li>Understand the assessment process</li>
                        <li>Review common psychological evaluation components</li>
                      </>
                    )}
                    {badge.id === "full" && (
                      <>
                        <li>Complete all five preparation areas</li>
                        <li>Submit your application</li>
                        <li>Receive confirmation of your application</li>
                      </>
                    )}
                    {badge.id === "chat-participation" && (
                      <>
                        <li>Engage with Sgt. Ken at least 3 times</li>
                        <li>Ask questions about the recruitment process</li>
                        <li>Respond to Sgt. Ken's messages</li>
                      </>
                    )}
                    {badge.id === "first-response" && (
                      <>
                        <li>Receive your first response from Sgt. Ken</li>
                        <li>Read the information provided</li>
                        <li>Follow up with at least one question</li>
                      </>
                    )}
                    {badge.id === "application-started" && (
                      <>
                        <li>Begin the application process</li>
                        <li>Complete the initial application form</li>
                        <li>Submit your contact information</li>
                      </>
                    )}
                    {badge.id === "application-completed" && (
                      <>
                        <li>Complete all application sections</li>
                        <li>Submit all required documents</li>
                        <li>Receive application confirmation</li>
                      </>
                    )}
                    {badge.id === "frequent-user" && (
                      <>
                        <li>Visit the platform at least 5 times</li>
                        <li>Engage with content on multiple visits</li>
                        <li>Spend at least 10 minutes per visit</li>
                      </>
                    )}
                    {badge.id === "resource-downloader" && (
                      <>
                        <li>Download at least 3 recruitment resources</li>
                        <li>Access different types of materials</li>
                        <li>Review the downloaded content</li>
                      </>
                    )}
                    {badge.id === "hard-charger" && (
                      <>
                        <li>Ask at least 10 questions about the process</li>
                        <li>Submit your application</li>
                        <li>Engage consistently over a 2-week period</li>
                      </>
                    )}
                    {badge.id === "connector" && (
                      <>
                        <li>Share content with at least 5 people</li>
                        <li>Have at least 2 referrals sign up</li>
                        <li>Participate in community discussions</li>
                      </>
                    )}
                    {badge.id === "deep-diver" && (
                      <>
                        <li>Explore all sections of the recruitment platform</li>
                        <li>Spend at least 30 minutes in detailed content</li>
                        <li>Ask in-depth questions about specific topics</li>
                      </>
                    )}
                    {badge.id === "quick-learner" && (
                      <>
                        <li>Complete all basic information sections in one day</li>
                        <li>Score 90% or higher on knowledge checks</li>
                        <li>Progress through content efficiently</li>
                      </>
                    )}
                    {badge.id === "persistent-explorer" && (
                      <>
                        <li>Return to the platform for 5 consecutive days</li>
                        <li>Explore new content on each visit</li>
                        <li>Track your progress consistently</li>
                      </>
                    )}
                    {badge.id === "dedicated-applicant" && (
                      <>
                        <li>Submit your application</li>
                        <li>Continue engaging with the platform after applying</li>
                        <li>Refer at least one other potential applicant</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {!earned && currentUser && (
                  <Button
                    onClick={() => {
                      onShare?.()
                      setIsDialogOpen(false)
                    }}
                    className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#0A3C1F] dark:hover:bg-[#0A3C1F]/90 dark:text-[#FFD700]"
                  >
                    <Share2 className="h-4 w-4 mr-2" /> Share to Progress
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        {currentUser ? (
          <Button
            onClick={onShare}
            className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#0A3C1F] dark:hover:bg-[#0A3C1F]/90 dark:text-[#FFD700]"
            disabled={earned}
          >
            <Share2 className="h-4 w-4 mr-2" />
            {earned ? "Badge Earned" : "Share to Progress"}
          </Button>
        ) : (
          <Button className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#0A3C1F] dark:hover:bg-[#0A3C1F]/90 dark:text-[#FFD700]">
            Sign In to Track Progress
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
