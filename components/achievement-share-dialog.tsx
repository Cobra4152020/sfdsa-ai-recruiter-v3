"use client"

import type React from "react"

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
  Loader2,
  Play,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { SocialSharingService, type SocialPlatform } from "@/lib/social-sharing-service"
import { useUser } from "@/context/user-context"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useAuthModal } from "@/context/auth-modal-context"

// TikTok icon component
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

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
  const { currentUser } = useUser()
  const { openModal } = useAuthModal()
  const [isSharing, setIsSharing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [isPreviewAnimated, setIsPreviewAnimated] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [isAnimated, setIsAnimated] = useState(true)
  const [showInstagramInstructions, setShowInstagramInstructions] = useState(false)
  const [instagramImageUrl, setInstagramImageUrl] = useState<string | null>(null)
  const [showTikTokInstructions, setShowTikTokInstructions] = useState(false)
  const [tiktokVideoUrl, setTiktokVideoUrl] = useState<string | null>(null)

  // Add this function to handle fallback responses
  const handleFallbackResponse = async (response: any, platform: string) => {
    if (response.fallback && response.imageUrl) {
      // Create a download link for the fallback image
      const link = document.createElement("a")
      link.href = response.imageUrl
      link.download = `${achievement.type}-${achievement.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Share recorded!",
        description: `Your ${platform} share has been recorded and points awarded. Download your image to share manually.`,
      })
      return true
    }
    return false
  }

  const handleShare = async (platform: SocialPlatform) => {
    if (!currentUser) {
      openModal("signin", "recruit")
      return
    }

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
        animated: isAnimated,
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
            setIsPreviewAnimated(!!result.isAnimated)
            setShowInstagramInstructions(true)
          } else {
            toast({
              title: "Instagram sharing failed",
              description: "Unable to generate Instagram story image. Please try again.",
              variant: "destructive",
            })
          }
        } else if (platform === "tiktok") {
          if (result.videoUrl) {
            setTiktokVideoUrl(result.videoUrl)
            setShowTikTokInstructions(true)
          } else {
            toast({
              title: "TikTok sharing failed",
              description: "Unable to generate TikTok video. Please try again.",
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
    link.download = `${achievement.type}-${achievement.id}${isPreviewAnimated ? "-animated.gif" : ".png"}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Image downloaded!",
      description: "Now you can share it to your Instagram story.",
    })
  }

  const handleDownloadTikTokVideo = () => {
    if (!tiktokVideoUrl) return

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = tiktokVideoUrl
    link.download = `${achievement.type}-${achievement.id}-tiktok.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Video downloaded!",
      description: "Now you can share it to your TikTok.",
    })
  }

  const generatePreview = async () => {
    if (!currentUser) return

    setIsGeneratingPreview(true)

    try {
      const shareOptions = {
        title: achievement.title,
        text: achievement.description,
        url: achievement.shareUrl,
        image: achievement.imageUrl,
        achievementType: achievement.type,
        achievementId: achievement.id,
        userId: currentUser.id,
        animated: isAnimated,
      }

      const result = await SocialSharingService.getInstagramStoryImage(shareOptions)

      if (result.success && result.imageUrl) {
        setPreviewImageUrl(result.imageUrl)
        setIsPreviewAnimated(!!result.isAnimated)
      } else {
        toast({
          title: "Preview generation failed",
          description: result.error || "Unable to generate preview. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating preview:", error)
      toast({
        title: "Preview generation failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  // Clear preview when animation option changes
  const handleAnimationToggle = (newValue: boolean) => {
    setIsAnimated(newValue)
    setPreviewImageUrl(null) // Clear existing preview
  }

  // Then update the share functions to use this fallback handler
  // For example, in the handleInstagramShare function:
  const handleInstagramShare = async () => {
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
        animated: isAnimated,
      }

      const response = await SocialSharingService.getInstagramStoryImage(shareOptions)

      if (response.success && response.imageUrl) {
        setInstagramImageUrl(response.imageUrl)
        setIsPreviewAnimated(!!response.isAnimated)
        setShowInstagramInstructions(true)
      } else {
        const handled = await handleFallbackResponse(response, "Instagram")
        if (!handled) {
          toast({
            title: "Instagram sharing failed",
            description: response.error || "Unable to generate Instagram story image. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error sharing to Instagram:", error)
      toast({
        title: "Error",
        description: "Failed to generate Instagram story. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  // Similarly update the TikTok share function
  const handleTikTokShare = async () => {
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
        animated: isAnimated,
      }

      const response = await SocialSharingService.getTikTokVideo(shareOptions)

      if (response.success && response.videoUrl) {
        setTiktokVideoUrl(response.videoUrl)
        setShowTikTokInstructions(true)
      } else {
        const handled = await handleFallbackResponse(response, "TikTok")
        if (!handled) {
          toast({
            title: "TikTok sharing failed",
            description: response.error || "Unable to generate TikTok video. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error sharing to TikTok:", error)
      toast({
        title: "Error",
        description: "Failed to generate TikTok video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dialog-gold-border">
        <DialogHeader>
          <DialogTitle>Share Achievement</DialogTitle>
          <DialogDescription>
            Share your achievement with friends and family!
          </DialogDescription>
        </DialogHeader>

        {showInstagramInstructions && instagramImageUrl ? (
          <>
            <DialogHeader>
              <DialogTitle>Share to Instagram Story</DialogTitle>
              <DialogDescription>Follow these steps to share your achievement to Instagram Stories</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center py-4">
              <div className="relative w-full max-w-[200px] aspect-[9/16] mb-4 border rounded overflow-hidden">
                {isPreviewAnimated ? (
                  // For animated GIFs
                  <img
                    src={instagramImageUrl || "/placeholder.svg"}
                    alt="Instagram Story Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // For static images
                  <Image
                    src={instagramImageUrl || "/placeholder.svg"}
                    alt="Instagram Story Preview"
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <ol className="list-decimal pl-5 space-y-2 text-sm mb-4">
                <li>Download the {isPreviewAnimated ? "animated GIF" : "image"} by clicking the button below</li>
                <li>Open Instagram on your phone</li>
                <li>Tap the + icon at the top and select "Story"</li>
                <li>Swipe up to access your gallery or tap the gallery icon</li>
                <li>Select the downloaded {isPreviewAnimated ? "GIF" : "image"}</li>
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
        ) : showTikTokInstructions && tiktokVideoUrl ? (
          <>
            <DialogHeader>
              <DialogTitle>Share to TikTok</DialogTitle>
              <DialogDescription>Follow these steps to share your achievement on TikTok</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center py-4">
              <div className="relative w-full max-w-[200px] aspect-[9/16] mb-4 border rounded overflow-hidden">
                <video src={tiktokVideoUrl} controls className="w-full h-full object-cover" autoPlay loop muted />
              </div>

              <ol className="list-decimal pl-5 space-y-2 text-sm mb-4">
                <li>Download the video by clicking the button below</li>
                <li>Open TikTok on your phone</li>
                <li>Tap the + button at the bottom of the screen</li>
                <li>Tap "Upload" and select the downloaded video</li>
                <li>Add hashtags like #SFSheriff #LawEnforcement #Recruitment</li>
                <li>Add a caption about your achievement</li>
                <li>Tap "Post" to share with your followers</li>
              </ol>

              <Button onClick={handleDownloadTikTokVideo} className="w-full mb-2">
                <Download className="h-4 w-4 mr-2" />
                Download for TikTok
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setShowTikTokInstructions(false)
                  setTiktokVideoUrl(null)
                }}
              >
                Back to Sharing Options
              </Button>
            </div>
          </>
        ) : (
          <>
            <Tabs
              defaultValue="social"
              value="social"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="social">Share</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="social" className="py-4">
                <div className="flex items-center justify-between space-x-2 mb-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="animated-stories">Animated Content</Label>
                    <p className="text-muted-foreground text-xs">Create eye-catching animated stories & videos</p>
                  </div>
                  <Switch id="animated-stories" checked={isAnimated} onCheckedChange={handleAnimationToggle} />
                </div>

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
                    onClick={() => handleInstagramShare()}
                    className="flex flex-col items-center h-auto py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]"
                    disabled={isSharing}
                  >
                    {isSharing && "instagram" ? (
                      <Loader2 className="h-5 w-5 mb-1 animate-spin" />
                    ) : (
                      <Instagram className="h-5 w-5 mb-1" />
                    )}
                    <span className="text-xs">Instagram</span>
                  </Button>

                  <Button
                    onClick={() => handleTikTokShare()}
                    className="flex flex-col items-center h-auto py-3 bg-black hover:bg-black/90"
                    disabled={isSharing}
                  >
                    {isSharing && "tiktok" ? (
                      <Loader2 className="h-5 w-5 mb-1 animate-spin" />
                    ) : (
                      <TikTokIcon className="h-5 w-5 mb-1" />
                    )}
                    <span className="text-xs">TikTok</span>
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
                <div className="flex flex-col items-center space-y-4">
                  {previewImageUrl ? (
                    <div className="relative w-full max-w-[250px] aspect-[9/16] border rounded overflow-hidden">
                      {isPreviewAnimated ? (
                        <img
                          src={previewImageUrl || "/placeholder.svg"}
                          alt="Instagram Story Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={previewImageUrl || "/placeholder.svg"}
                          alt="Instagram Story Preview"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 mb-4 bg-gray-50 dark:bg-gray-900 w-full">
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
                  )}

                  <Button onClick={generatePreview} disabled={isGeneratingPreview} className="w-full">
                    {isGeneratingPreview ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Preview...
                      </>
                    ) : (
                      <>
                        {previewImageUrl ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Regenerate {isAnimated ? "Animated" : "Static"} Preview
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Generate {isAnimated ? "Animated" : "Static"} Preview
                          </>
                        )}
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between w-full mt-2">
                    <Label htmlFor="preview-animated" className="text-sm">
                      {isAnimated ? "Animated Content" : "Static Content"}
                    </Label>
                    <Switch id="preview-animated" checked={isAnimated} onCheckedChange={handleAnimationToggle} />
                  </div>

                  <p className="text-xs text-center text-muted-foreground mt-2">
                    {isAnimated
                      ? "Animated content is more eye-catching but may take longer to generate."
                      : "Static images load faster but don't include animations."}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
