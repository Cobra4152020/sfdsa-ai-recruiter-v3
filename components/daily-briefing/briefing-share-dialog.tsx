"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Instagram,
  ExternalLink,
} from "lucide-react";
import { useUser } from "@/context/user-context";
import { useToast } from "@/components/ui/use-toast";
import { getClientSideSupabase } from "@/lib/supabase";

interface PlatformOption {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  points: number;
}

interface BriefingShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  briefingId: string;
  briefingTitle: string;
}

export function BriefingShareDialog({
  open,
  onOpenChange,
  briefingId,
  briefingTitle,
}: BriefingShareDialogProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [sharedPlatforms, setSharedPlatforms] = useState<Set<string>>(new Set());
  const [shareError, setShareError] = useState<string | null>(null);
  const { currentUser } = useUser();
  const { toast } = useToast();

  const platforms: PlatformOption[] = [
    { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-blue-400", points: 10 },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600", points: 10 },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700", points: 15 },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-600", points: 10 },
    { id: "email", name: "Email", icon: Mail, color: "bg-gray-600", points: 5 },
  ];

  const handleShare = async (platform: PlatformOption) => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to share the daily briefing.",
        variant: "destructive",
      });
      return;
    }

    if (sharedPlatforms.has(platform.id)) {
      toast({
        title: "Already Shared",
        description: `You've already shared on ${platform.name}.`,
        variant: "default",
      });
      return;
    }

    try {
      setIsSharing(true);
      setShareError(null);

      // Create share message and URL
      const shareMessage = encodeURIComponent(
        `Check out today's San Francisco Deputy Sheriff's Daily Briefing: "${briefingTitle}" - Join us in building a safer community! 🚔 #SFDSA #CommunityFirst`
      );
      const shareUrl = encodeURIComponent(`${window.location.origin}/daily-briefing`);

      // Generate platform-specific share URLs
      let platformShareUrl = "";
      
      switch (platform.id) {
        case "twitter":
          platformShareUrl = `https://twitter.com/intent/tweet?text=${shareMessage}&url=${shareUrl}`;
          break;
        case "facebook":
          platformShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareMessage}`;
          break;
        case "linkedin":
          platformShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&summary=${shareMessage}`;
          break;
        case "email":
          platformShareUrl = `mailto:?subject=${encodeURIComponent("SF Deputy Sheriff Daily Briefing")}&body=${shareMessage}%0A%0A${shareUrl}`;
          break;
        case "instagram":
          // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
          await navigator.clipboard.writeText(`${decodeURIComponent(shareMessage)} ${decodeURIComponent(shareUrl)}`);
          toast({
            title: "Copied to Clipboard",
            description: "Share content copied! Paste it into your Instagram post.",
            variant: "default",
          });
          break;
      }

      // Open share URL for all platforms except Instagram
      if (platform.id !== "instagram" && platformShareUrl) {
        const popup = window.open(
          platformShareUrl,
          "_blank",
          "width=600,height=500,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no"
        );

        // Check if popup was blocked
        if (!popup) {
          // Fallback: copy to clipboard if popup is blocked
          await navigator.clipboard.writeText(`${decodeURIComponent(shareMessage)} ${decodeURIComponent(shareUrl)}`);
          toast({
            title: "Popup Blocked",
            description: "Share content copied to clipboard. Please paste it manually.",
            variant: "default",
          });
        }
      }

      // Record the share in the database and award points
      const supabase = getClientSideSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        const response = await fetch("/api/daily-briefing/share", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            briefingId,
            platform: platform.id,
          }),
        });

        if (response.ok) {
          // Mark platform as shared
          setSharedPlatforms(prev => new Set(prev).add(platform.id));
          
          toast({
            title: `+${platform.points} Points Earned! 🎉`,
            description: `Thanks for sharing on ${platform.name}!`,
            variant: "default",
          });
        } else {
          const errorData = await response.json();
          if (errorData.error.includes("already shared")) {
            toast({
              title: "Already Shared",
              description: `You've already earned points for sharing on ${platform.name}.`,
              variant: "default",
            });
          } else {
            throw new Error(errorData.error);
          }
        }
      }

    } catch (error) {
      console.error("Error sharing:", error);
      setShareError(`Failed to record share on ${platform.name}. Please try again.`);
      toast({
        title: "Share Error",
        description: `There was an issue recording your share on ${platform.name}.`,
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const isPlatformShared = (platformId: string) => {
    return sharedPlatforms.has(platformId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Daily Briefing</DialogTitle>
          <DialogDescription>
            Share today&apos;s briefing with your network and earn points for spreading awareness about community safety.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {platforms.map((platform) => {
            const isShared = isPlatformShared(platform.id);

            return (
              <Button
                key={platform.id}
                variant="outline"
                className={`flex items-center justify-center h-20 transition-all ${
                  isShared ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""
                }`}
                onClick={() => handleShare(platform)}
                disabled={isSharing || isShared}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={`rounded-full p-2 text-white transition-all ${
                      isShared ? "bg-green-500" : platform.color
                    }`}
                  >
                    {isShared ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <platform.icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium">{platform.name}</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {isShared ? "Shared!" : `+${platform.points} pts`}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {shareError && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            {shareError}
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {sharedPlatforms.size > 0 && (
              <span>Shared on {sharedPlatforms.size} platform{sharedPlatforms.size > 1 ? 's' : ''}</span>
            )}
          </div>

          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
