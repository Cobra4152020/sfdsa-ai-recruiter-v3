"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Medal, Share2, Facebook, Twitter, Linkedin, Mail, Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useBadges } from "@/hooks/use-badges"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"

interface BadgeDisplayProps {
  userId?: string
  isLoggedIn?: boolean
  onLoginClick?: () => void
}

export function BadgeDisplay({ userId, isLoggedIn = false, onLoginClick }: BadgeDisplayProps) {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get category from URL or default to 'all'
  const initialCategory = searchParams.get("badgeCategory") || "all"
  const [category, setCategory] = useState<"all" | "application" | "participation">(initialCategory as any)

  const { userBadges, availableBadges, isLoading, error, refetch } = useBadges(userId)
  const [selectedBadge, setSelectedBadge] = useState<any>(null)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    params.set("badgeCategory", category)
    params.set("tab", "badges")
    router.push(`/awards?${params.toString()}`, { scroll: false })
  }, [category, router, searchParams])

  if (!isLoggedIn) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Medal className="h-12 w-12 text-yellow-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Earn Badges</h3>
          <p className="text-center text-muted-foreground mb-6 max-w-md">
            Sign up or log in to earn badges by engaging with our AI assistant and completing steps in the application
            process.
          </p>
          <Button onClick={onLoginClick} className="bg-primary hover:bg-primary/90 text-white">
            Sign Up Now
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleShare = (badge: any) => {
    setSelectedBadge(badge)
    setIsShareDialogOpen(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Link copied!",
      description: "Badge link has been copied to clipboard.",
      duration: 2000,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = selectedBadge ? `${window.location.origin}/user-badge/${selectedBadge.id}` : ""
  const shareTitle = selectedBadge ? `I earned the ${selectedBadge.name} badge at SF Deputy Sheriff!` : ""
  const shareText = selectedBadge
    ? `Check out my ${selectedBadge.name} badge from the San Francisco Sheriff's Office recruitment program!`
    : ""

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center">
              <Medal className="h-5 w-5 text-yellow-400 mr-2" />
              {isLoggedIn ? "Your Badges" : "Badge Legend"}
            </CardTitle>
            <Tabs defaultValue={category} value={category} onValueChange={(value) => setCategory(value as any)}>
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Failed to load badges. Please try again.</p>
              <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {isLoggedIn && userBadges.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Earned Badges</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {userBadges
                      .filter(
                        (badge) =>
                          category === "all" ||
                          (category === "application" && badge.category === "application") ||
                          (category === "participation" && badge.category === "participation"),
                      )
                      .map((badge) => (
                        <div key={badge.id} className="flex flex-col items-center text-center">
                          <div
                            className={cn("rounded-full w-16 h-16 flex items-center justify-center mb-2", badge.color)}
                          >
                            <img
                              src={badge.icon || "/placeholder.svg"}
                              alt={badge.name}
                              className="w-10 h-10 object-contain"
                            />
                          </div>
                          <h4 className="font-medium text-sm">{badge.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 h-7 text-xs"
                            onClick={() => handleShare(badge)}
                          >
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-4">Available Badges</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {availableBadges
                    .filter(
                      (badge) =>
                        category === "all" ||
                        (category === "application" && badge.category === "application") ||
                        (category === "participation" && badge.category === "participation"),
                    )
                    .map((badge) => {
                      const isEarned = userBadges.some((userBadge) => userBadge.id === badge.id)
                      return (
                        <TooltipProvider key={badge.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col items-center text-center">
                                <div
                                  className={cn(
                                    "rounded-full w-16 h-16 flex items-center justify-center mb-2",
                                    badge.color,
                                    !isEarned && "opacity-50 grayscale",
                                  )}
                                >
                                  <img
                                    src={badge.icon || "/placeholder.svg"}
                                    alt={badge.name}
                                    className="w-10 h-10 object-contain"
                                  />
                                </div>
                                <h4 className="font-medium text-sm">{badge.name}</h4>
                                {isEarned && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-1 h-7 text-xs"
                                    onClick={() => handleShare(badge)}
                                  >
                                    <Share2 className="h-3 w-3 mr-1" />
                                    Share
                                  </Button>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-medium">{badge.name}</p>
                              <p className="text-xs">{badge.description}</p>
                              {!isEarned && <p className="text-xs italic mt-1">Not yet earned</p>}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Badge Sharing Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Badge</DialogTitle>
          </DialogHeader>
          {selectedBadge && (
            <div className="flex flex-col items-center py-4">
              <div className={cn("rounded-full w-24 h-24 flex items-center justify-center mb-4", selectedBadge.color)}>
                <img
                  src={selectedBadge.icon || "/placeholder.svg"}
                  alt={selectedBadge.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="font-bold text-lg mb-1">{selectedBadge.name}</h3>
              <p className="text-sm text-center text-muted-foreground mb-6">{selectedBadge.description}</p>

              <div className="grid grid-cols-2 gap-3 w-full mb-4">
                <Button
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`,
                      "_blank",
                    )
                  }
                  className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
                      "_blank",
                    )
                  }
                  className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                      "_blank",
                    )
                  }
                  className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
                      "_blank",
                    )
                  }
                  className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-500/90"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              </div>

              <div className="flex items-center w-full border rounded-md overflow-hidden">
                <div className="bg-muted px-3 py-2 text-sm flex-1 truncate">{shareUrl}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-full rounded-none px-3"
                  onClick={() => copyToClipboard(shareUrl)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
