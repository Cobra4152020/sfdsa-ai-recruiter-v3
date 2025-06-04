"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Copy,
  Check,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  SocialSharingService,
  type SocialPlatform,
  type ShareOptions,
} from "@/lib/social-sharing-service";
import { useUser } from "@/context/user-context";
// import Image from "next/image"; // Unused
// import { Switch } from "@/components/ui/switch"; // Unused
import { Label } from "@/components/ui/label";
import { useAuthModal } from "@/context/auth-modal-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Added import for Textarea
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion"; // Removed motion

// TikTok icon component (unused, so commenting out)
// const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     {...props}
//   >
//     <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
//   </svg>
// );

export interface AchievementShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    // Added fields based on usage, to be confirmed if they exist on the actual type
    shareUrl?: string;
    title?: string;
    type?: string;
  };
  // triggerElementName?: string; // Unused
}

const socialPlatforms: Record<
  Extract<SocialPlatform, "twitter" | "facebook" | "linkedin" | "whatsapp">,
  { Icon: React.ElementType; name: string }
> = {
  twitter: { Icon: Twitter, name: "Twitter" },
  facebook: { Icon: Facebook, name: "Facebook" },
  linkedin: { Icon: Linkedin, name: "LinkedIn" },
  whatsapp: { Icon: MessageCircle, name: "WhatsApp" },
};

export function AchievementShareDialog({
  isOpen,
  onClose,
  achievement,
}: AchievementShareDialogProps) {
  // Removed triggerElementName
  const { currentUser } = useUser();
  const { openModal } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmailTo, setCurrentEmailTo] = useState("");
  const [currentCustomMessage, setCurrentCustomMessage] = useState("");
  // const [isAnimated, setIsAnimated] = useState(false); // Commented out unused variable
  const { toast } = useToast();

  // Assuming these state variables are declared somewhere above or this is a partial snippet
  const [copied, setCopied] = useState(false);
  const [currentEmailSubject, setCurrentEmailSubject] = useState("");

  // Moved achievementUrl inside the component, as achievement is a prop
  const achievementUrl = achievement?.shareUrl ?? "";

  const handleShare = async (platform: SocialPlatform) => {
    if (!currentUser) {
      openModal("signin", "recruit");
      return;
    }
    setIsLoading(true);
    try {
      const shareOptions: ShareOptions = {
        title: achievement.title ?? achievement.name, // Fallback for title
        text: achievement.description ?? "",
        url: achievementUrl,
        hashtags: ["SFSheriff", "LawEnforcement", "Recruitment"],
        via: "SFSheriff", // Optional: Twitter username
        image: achievement.imageUrl,
        achievementType: achievement.type ?? "general", // Fallback for type
        achievementId: achievement.id,
        userId: currentUser.id,
        animated: false, // isAnimated IS used in shareOptions
      };
      const result = await SocialSharingService.share(platform, shareOptions);
      if (result.success) {
        toast({
          title: "Shared successfully!",
          description: `You earned 25 points for sharing your achievement.`,
        });
      } else {
        toast({
          title: "Sharing failed",
          description: result.error || "Unable to share. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Sharing failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (actionType: "copy" | "email") => {
    if (actionType === "copy") {
      if (!achievementUrl) {
        toast({
          title: "Error",
          description: "Achievement URL not available.",
          variant: "destructive",
        });
        return;
      }
      try {
        await navigator.clipboard.writeText(achievementUrl);
        setCopied(true);
        toast({
          title: "Copied!",
          description: "Achievement link copied to clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        toast({
          title: "Copy failed",
          description: "Could not copy link.",
          variant: "destructive",
        });
      }
    } else if (actionType === "email") {
      if (!currentUser) {
        openModal("signin", "recruit");
        return;
      }
      setIsLoading(true);
      try {
        const emailOptions: ShareOptions = {
          title: currentEmailSubject || (achievement.title ?? achievement.name),
          text:
            currentCustomMessage ||
            (achievement.description ?? "Check out this achievement!"),
          url: achievementUrl,
          userId: currentUser.id, // For tracking if needed by SocialSharingService
        };
        const result = await SocialSharingService.share("email", emailOptions);
        if (result.success) {
          toast({
            title: "Email Sent!",
            description: "Achievement shared via email.",
          });
          setCurrentEmailTo("");
          setCurrentEmailSubject("");
          setCurrentCustomMessage("");
        } else {
          toast({
            title: "Email Failed",
            description: result.error || "Could not send email.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error sending email:", error);
        toast({
          title: "Email Failed",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // const handleEmailShare = async () => { // Commented out unused function
  //   // Email sharing implementation
  // };

  if (!isOpen || !achievement) {
    return null;
  }

  return (
    <AnimatePresence>
      <TooltipProvider>
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md dialog-gold-border">
            <DialogHeader>
              <DialogTitle>Share Achievement</DialogTitle>
              <DialogDescription>
                Share your achievement with friends and family!
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="social">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="email" className="w-full">
                  <Mail className="mr-2 h-4 w-4" /> Email a Friend
                </TabsTrigger>
              </TabsList>
              <TabsContent value="social" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Share your &quot;{achievement.name}&quot; badge on your
                  favorite social media platforms.
                </p>
                <div className="flex flex-wrap gap-2">
                  {(
                    Object.keys(socialPlatforms) as Array<
                      keyof typeof socialPlatforms
                    >
                  ).map((key) => {
                    const platformDetails = socialPlatforms[key];
                    return (
                      <Button
                        key={key}
                        variant="outline"
                        onClick={() => handleShare(key)}
                        disabled={isLoading}
                        className="flex-1 min-w-[120px]"
                      >
                        <platformDetails.Icon className="mr-2 h-4 w-4" />
                        {platformDetails.name}
                      </Button>
                    );
                  })}
                </div>
                <div className="relative">
                  <Input
                    value={achievementUrl}
                    readOnly
                    placeholder="Achievement link..."
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                    onClick={() => handleAction("copy")}
                    disabled={isLoading || !achievementUrl}
                  >
                    {copied ? (
                      <Check className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="mr-1 h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="email" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Email this achievement to a friend or colleague.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAction("email");
                  }}
                >
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="emailTo">Recipient&apos;s Email</Label>
                      <Input
                        id="emailTo"
                        type="email"
                        placeholder="friend@example.com"
                        value={currentEmailTo}
                        onChange={(e) => setCurrentEmailTo(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailSubject">Subject</Label>
                      <Input
                        id="emailSubject"
                        placeholder={`Check out my achievement: ${achievement.name}`}
                        value={currentEmailSubject}
                        onChange={(e) => setCurrentEmailSubject(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="customMessage">Message (optional)</Label>
                      <Textarea
                        id="customMessage"
                        placeholder={`I thought you'd like to see this: ${achievementUrl}`}
                        value={currentCustomMessage}
                        onChange={(e) =>
                          setCurrentCustomMessage(e.target.value)
                        }
                        disabled={isLoading}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button
                      type="submit"
                      disabled={isLoading || !currentEmailTo}
                    >
                      {isLoading ? "Sending..." : "Send Email"}
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </AnimatePresence>
  );
}
