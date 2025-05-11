"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Share2,
  MessageCircle,
  Download,
  Instagram,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { SocialSharingService, type SocialPlatform } from "@/lib/social-sharing-service"
import { useUser } from "@/context/user-context"
import Image from "next/image"

interface AchievementShareDialogProps {
  isOpen: boolean
  onClose: () => void
  achievement: {
    title: string
    description: string
    imageUrl?: string
    shareUrl: string
    type: string
    id: string
  }
}

export function AchievementShareDialog({ isOpen, onClose, achievement }: AchievementShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"social" | "preview">("social")
  const [isSharing, setIsSharing] = useState(false)
  const [instagramImageUrl, setInstagramImageUrl] = useState<string | null>(null)
  const [showInstagramInstructions, setShowInstagramInstructions] = useState(false)
  const { currentUser } = useUser()

  const handleShare = async (platform: SocialPlatform) => {
    if (!currentUser) return

    setIsSharing(true)

    try {
      const shareOptions = {
        title: achievement.title,
        text: achievement.description,
        url: achievement.shareUrl,
        hashtags: ["SFSheriff", "LawEnforcement", "Recruitment"],
        via: "SFSheriff",
        image: achievement.imageUrl,
        achievementType: achievement.type,
        achievementId: achievement.id,
        userId: currentUser.id,
      }

      const result = await SocialSharingService.share(platform, shareOptions)

      if (result.success) {
        if (platform === "copy") {
          setCopied(true)
          toast({
            title: "Link copied!",
            description: "Share this link with others to show your achievement.",
          })
          setTimeout(() => setCopied(false), 2000)
        } else if (platform === "instagram") {
          if (result.imageUrl) {
            setInstagramImageUrl(result.imageUrl)
            setShowInstagramInstructions(true)
          } else {
            toast({
              title: "Instagram sharing failed",
              description: "Unable to generate Instagram story image. Please try again.",
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Shared successfully!",
            description: `You earned 25 points for sharing your achievement.`,
          })
        }
      } else {
        toast({
          title: "Sharing failed",
          description: result.error || "Unable to share. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Sharing failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const handleDownloadInstagramImage = () => {
    if (!instagramImageUrl) return

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = instagramImageUrl
    link.download = `${achievement.type}-${achievement.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Image downloaded!",
      description: "Now you can share it to your Instagram story.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {showInstagramInstructions && instagramImageUrl ? (
          <>
            <DialogHeader>
              <DialogTitle>Share to Instagram Story</DialogTitle>
              <DialogDescription>Follow these steps to share your achievement to Instagram Stories</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center py-4">
              <div className="relative w-full max-w-[200px] aspect-[9/16] mb-4 border rounded overflow-hidden">
                <Image
                  src={instagramImageUrl || "/placeholder.svg"}
                  alt="Instagram Story Preview"
                  fill
                  className="object-cover"
                />
              </div>

              <ol className="list-decimal pl-5 space-y-2 text-sm mb-4">
                <li>Download the image by clicking the button below</li>
                <li>Open Instagram on your phone</li>
                <li>Tap the + icon at the top and select "Story"</li>
                <li>Swipe up to access your gallery or tap the gallery icon</li>
                <li>Select the downloaded image</li>
                <li>Add any additional stickers or text if desired</li>
                <li>Tap "Your Story" to share</li>
              </ol>

              <Button onClick={handleDownloadInstagramImage} className="w-full mb-2">
                <Download className="h-4 w-4 mr-2" />
                Download for Instagram Story
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setShowInstagramInstructions(false)
                  setInstagramImageUrl(null)
                }}
              >
                Back to Sharing Options
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Share Your Achievement</DialogTitle>
              <DialogDescription>
                Share your achievement with friends and family to show your progress in the SF Sheriff's recruitment
                process.
              </DialogDescription>
            </DialogHeader>

            <Tabs
              defaultValue="social"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "social" | "preview")}
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="social">Share</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="social" className="py-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    onClick={() => handleShare("twitter")}
                    className="flex flex-col items-center h-auto py-3 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
                    disabled={isSharing}
                  >
                    <Twitter className="h-5 w-5 mb-1" />
                    <span className="text-xs">Twitter</span>
                  </Button>

                  <Button
                    onClick={() => handleShare("facebook")}
                    className="flex flex-col items-center h-auto py-3 bg-[#1877F2] hover:bg-[#1877F2]/90"
                    disabled={isSharing}
                  >
                    <Facebook className="h-5 w-5 mb-1" />
                    <span className="text-xs">Facebook</span>
                  </Button>

                  <Button
                    onClick={() => handleShare("linkedin")}
                    className="flex flex-col items-center h-auto py-3 bg-[#0A66C2] hover:bg-[#0A66C2]/90"
                    disabled={isSharing}
                  >
                    <Linkedin className="h-5 w-5 mb-1" />
                    <span className="text-xs">LinkedIn</span>
                  </Button>

                  <Button
                    onClick={() => handleShare("instagram")}
                    className="flex flex-col items-center h-auto py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]"
                    disabled={isSharing}
                  >
                    <Instagram className="h-5 w-5 mb-1" />
                    <span className="text-xs">Instagram</span>
                  </Button>

                  <Button
                    onClick={() => handleShare("whatsapp")}
                    className="flex flex-col items-center h-auto py-3 bg-[#25D366] hover:bg-[#25D366]/90"
                    disabled={isSharing}
                  >
                    <MessageCircle className="h-5 w-5 mb-1" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>

                  <Button
                    onClick={() => handleShare("email")}
                    className="flex flex-col items-center h-auto py-3 bg-gray-500 hover:bg-gray-600"
                    disabled={isSharing}
                  >
                    <Mail className="h-5 w-5 mb-1" />
                    <span className="text-xs">Email</span>
                  </Button>

                  <Button
                    onClick={() => handleShare("copy")}
                    variant="outline"
                    className="flex flex-col items-center h-auto py-3"
                    disabled={isSharing}
                  >
                    {copied ? <Check className="h-5 w-5 mb-1 text-green-500" /> : <Copy className="h-5 w-5 mb-1" />}
                    <span className="text-xs">{copied ? "Copied!" : "Copy Link"}</span>
                  </Button>
                </div>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>Earn 25 points each time you share your achievements!</p>
                  <p className="mt-1">Share 5 times to earn the Connector badge.</p>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="py-4">
                <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 relative">
                      {achievement.imageUrl ? (
                        <Image
                          src={achievement.imageUrl || "/placeholder.svg"}
                          alt={achievement.title}
                          width={48}
                          height={48}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#0A3C1F] rounded-md flex items-center justify-center">
                          <Share2 className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">San Francisco Sheriff's Department</h3>
                      <p className="text-xs text-muted-foreground mb-2">Achievement Unlocked</p>

                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>

                      <div className="mt-3 text-xs text-blue-600 dark:text-blue-400">sfdeputysheriff.com</div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  This is how your achievement will appear when shared on most platforms. Actual appearance may vary by
                  platform.
                </p>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
